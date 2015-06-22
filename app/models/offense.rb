# Offense model.
class Offense < ActiveRecord::Base
  belongs_to :file, class_name: 'RevisionFile', foreign_key: :file_id

  enum severity: [:refactor, :convention, :warning, :error, :fatal]
end
