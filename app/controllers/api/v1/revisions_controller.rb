# Api Revision controller
class Api::V1::RevisionsController < Api::V1::BaseController
  load_and_auth_revision parents: true

  def create
    RevisionScan.new(@branch).scan(params[:sha])
    render json: @repository, status: :accepted
  end

  protected def revision_params
    params.permit(:sha)
  end
end
