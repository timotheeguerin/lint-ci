# Revision model. Correspond to a commit
class Revision < ActiveRecord::Base
  belongs_to :repository

  has_many :files, class_name: 'RevisionFile', dependent: :destroy

  validates :sha, presence: true, uniqueness: true
end
