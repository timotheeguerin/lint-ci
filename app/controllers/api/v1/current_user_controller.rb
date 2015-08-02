# Repositories user controller
class Api::V1::CurrentUserController < Api::V1::BaseController
  before_action do
    authorize! :current, current_user
  end

  # GET /api/v1/user
  # render the current user
  def show
    render json: current_user
  end

  # GET /api/v1/user/repos
  # render the current user repositories
  def current_repos
    render json: current_user.repositories
  end

  # POST /api/v1/user/repos/sync
  # Sync all the user repositories
  def sync_repos
    current_user.sync_repositories(github)
    SyncRepositoriesJob.perform_later(current_user)
    render json: {}, status: :accepted
  end
end
