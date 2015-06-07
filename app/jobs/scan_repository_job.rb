# Job that take care of calling the linter and storing the offenses in the database
class ScanRepositoryJob < ActiveJob::Base
  queue_as :default

  def perform(*args)

  end
end
