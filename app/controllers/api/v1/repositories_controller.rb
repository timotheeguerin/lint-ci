# Repository API controller
class Api::V1::RepositoriesController < Api::V1::BaseController
  load_and_auth_repository parents: true

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
    queued = RevisionScan.new(@repository).scan
    status = queued ? :accepted : :ok
    render json: @repository, status: status
  end

  def init
    @repository = Repository.new
    @repositories = Repository.none
  end

  def query_params
    params.permit(:enabled)
  end

  protected def create_webhook
    url = api_revisions_hook_url(@repository.owner, @repository)
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
