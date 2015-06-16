# Repositories user controller
class Api::V1::CurrentUserController < Api::V1::BaseController
  before_action do
    authorize! :current, current_user
  end

  # /api/v1/user
  # render the current user
  def show
    render json: current_user
  end

  # /api/v1/user/repos
  # render the current user repositories
  def current_repos
    render json: current_user.repositories
  end
end
