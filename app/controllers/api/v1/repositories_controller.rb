# Repository API controller
class Api::V1::RepositoriesController < Api::V1::BaseController
  load_and_auth_user
  load_and_auth_repository except: [:index, :webhook]

  def index
    params[:type] ||= 'owner'
    if params[:type] == 'owner'
      @repositories = @user.repos
    elsif params[:type] == 'member'
      @repositories = @user.repositories
    end
    super
  end

  def enable
    create_webhook
    @repository.enabled = true
    @repository.save
    render json: @repository
  end

  def disable
    delete_webhook
    @repository.enabled = false
    @repository.save
    render json: @repository
  end

  def init
    @repository = Repository.new
    @repositories = Repository.none
  end

  def query_params
    params.permit(:enabled)
  end

  # Github triggered hook
  def webhook
    @repository = @user.repositories.find(params[:repo])
    branch_name = params[:ref].split('/')[-1]
    branch = @repository.branches.find_by_name(branch_name)
    if branch.nil?
      branch = @repository.branches.build(name: branch_name)
      branch.save
    end
    @repository.transaction do
      queued = RevisionScan.new(branch).scan(params[:after])
      status = queued ? :accepted : :ok
      render json: {success: 'Repository queued for scan!'}, status: status
    end
  end

  protected def create_webhook
    url = api_repository_hook_url(@repository.owner, @repository)
    github.create_hook(@repository, url) do |hook|
      @repository.update(hook_id: hook.id)
    end
  end

  protected def delete_webhook
    github.remove_hook(@repository) do
      @repository.update(hook_id: nil)
    end
  end
end
