# Repository API controller
class Api::V1::RepositoriesController < Api::V1::BaseController
  load_and_authorize_resource :user
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
      unless @repository.refreshing
        job = ScanRepositoryJob.perform_later(@repository)
        @repository.job_id = job.job_id
        @repository.save
      end
    end
    render json: @repository
  end

  def init
    @repository = Repository.new
    @repositories = Repository.empty
  end

  def query_params
    params.permit(:enabled)
  end

  protected def create_webhook
    github.create_hook(@repository, api_v1_revisions_url) do |hook|
      repo.update(hook_id: hook.id)
    end
  end

  protected def delete_webhook
    github.remove_hook(@repository, repo.hook_id) do
      repo.update(hook_id: nil)
    end
  end
end
