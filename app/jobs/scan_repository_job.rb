# Job that take care of calling the linter and storing the offenses in the database
class ScanRepositoryJob < ActiveJob::Base
  queue_as :default

  def perform(repository)
    builder = LintCI::Builder.new(repository)
    builder.run
    repository.reload
    repository.update_attributes(job_id: nil)
  end
end
