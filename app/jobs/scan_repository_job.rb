# Job that take care of calling the linter and storing the offenses in the database
class ScanRepositoryJob < ActiveJob::Base
  queue_as :default

  rescue_from(ActiveRecord::RecordNotFound) do |e|
    puts "Revision seems to have benn deleted before scanning could start: #{e}"
  end

  def perform(revision)
    revision.update_attributes(status: :processing)
    builder = LintCI::Builder.new(revision)
    builder.run
  ensure
    revision.reload
    revision.update_attributes(status: :scanned)
  end
end
