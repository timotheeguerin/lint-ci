# Revision model. Correspond to a commit
class Revision < ActiveRecord::Base
  include FriendlyId
  friendly_id :sha, use: [:finders]

  belongs_to :repository

  has_many :files, class_name: 'RevisionFile', dependent: :destroy
  has_many :linters, dependent: :destroy

  validates :sha, presence: true, uniqueness: {scope: :repository_id}

  def status
    case offense_count
    when 0
      :perfect
    when 1..5
      :great
    when 6..10
      :good
    when 11..15
      :acceptable
    when 16..20
      :warning
    when 21..30
      :dirty
    else
      :bad
    end
  end
end
