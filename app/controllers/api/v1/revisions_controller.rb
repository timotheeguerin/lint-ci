# Api Revision controller
class Api::V1::RevisionsController < Api::V1::BaseController
  load_and_auth_repository parents: true
  load_and_auth_revision except: :webhook

  # Github triggered hook
  def webhook
    @repository.transaction do
      queued = RevisionScan.new(@repository).scan
      status = queued ? :accepted : :ok
      render json: {success: 'Repository queued for scan!'}, status: status
    end
  end
end
