# Revision File model
class RevisionFile < ActiveRecord::Base
  belongs_to :revision
  has_many :offenses
end
