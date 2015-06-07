# Job that sync the user repositories
class SyncRepositoriesJob < ActiveJob::Base
  queue_as :default

  def perform(*args)
    # Do something later
  end
end
