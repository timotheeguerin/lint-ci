# Job that take care of calling the linter and storing the offenses in the database
class ScanRepositoryJob < ActiveJob::Base
  queue_as :default


  def perform(revision)
    revision.update_attributes(status: :processing)
    builder = LintCI::Builder.new(revision)
    builder.run
  ensure
    revision.reload
    revision.update_attributes(status: :scanned)
  end
end
