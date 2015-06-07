# Offense model.
class Offense < ActiveRecord::Base
  belongs_to :file, class_name: 'RevisionFile'

  enum severity: [:convention, :warning]
end
