# Revision File model
class RevisionFile < ActiveRecord::Base
  belongs_to :revision
  has_many :offenses, foreign_key: 'file_id', dependent: :destroy
end
