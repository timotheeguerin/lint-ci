# Repository API controller
class Api::V1::RepositoriesController < Api::V1::BaseController
  load_resource :user
  load_and_authorize_resource through: :user, through_association: :repos

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

  # Refresh to repo
  def refresh
    @repository.transaction do
      if @repository.refreshing
        render json: @repository
      else
        job = ScanRepositoryJob.perform_later(@repository)
        @repository.job_id = job.job_id
        @repository.save
        render json: @repository, status: :accepted
      end
    end
  end

  def init
    @repository = Repository.new
    @repositories = Repository.none
  end

  def query_params
    params.permit(:enabled)
  end

  protected def create_webhook
    url = api_revisions_url(@repository.owner, @repository)
    github.create_hook(@repository, url) do |hook|
      @repository.update(hook_id: hook.id)
    end
  end

  protected def delete_webhook
    github.remove_hook(@repository) do
      @repository.update(hook_id: nil)
    end
  end

  protected def github
    GithubApi.new(github_token)
  end
end
