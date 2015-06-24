# Api Revision controller
class Api::V1::RevisionsController < Api::V1::BaseController
  load_and_auth_repository parents: true
  load_and_auth_revision except: :webhook

  # Github triggered hook
  def webhook
    @repository.transaction do
      if @repository.refreshing
        render json: {success: 'Repository already scanning!'}
      else
        job = ScanRepositoryJob.perform_later(@repository)
        @repository.job_id = job.job_id
        @repository.save
        render json: {success: 'Repository queued for scan!'}, status: :accepted
      end
    end
  end
end
