# Repository API controller
class Api::V1::RepositoriesController < Api::V1::BaseController
  load_and_authorize_resource

  # Sync all the user repositories
  def sync
    current_user.sync_repositories
    render json: @repositories
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

  # Refresh to repo
  def refresh
    builder = LintCI::Builder.new(@repository)
    builder.run
    render json: @repository
  end

  def init
    @repository = Repository.new
    @repositories = Repository.empty
  end
end
