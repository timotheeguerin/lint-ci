class Api::V1::BranchesController < Api::V1::BaseController
  load_and_auth_branch parents: true

  def refresh
    SyncBranchesJob.perform_later(current_user, @repository)
    render json: @repository, status: :accepted
  end

  # Refresh to repo
  def scan
    queued = RevisionScan.new(@branch).scan
    status = queued ? :accepted : :ok
    render json: @repository, status: status
  end
end
