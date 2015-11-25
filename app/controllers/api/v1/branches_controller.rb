class Api::V1::BranchesController < Api::V1::BaseController
  load_and_auth_branch parents: true

  def refresh
    SyncBranchesJob.perform_now(current_user, @repository)
    render json: @repository, status: :accepted
  end

end
