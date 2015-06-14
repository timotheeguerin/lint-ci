# Offense model.
class Offense < ActiveRecord::Base
  belongs_to :file, class_name: 'RevisionFile', foreign_key: :file_id

  enum severity: [:convention, :warning]
end
