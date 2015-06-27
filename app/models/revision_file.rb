# Revision File model
class RevisionFile < ActiveRecord::Base
  include FriendlyId
  friendly_id :path, use: [:finders]

  belongs_to :revision
  has_many :offenses, foreign_key: 'file_id', dependent: :destroy

  delegate :repository, to: :revision

  validates :offense_count, presence: true
  validates :language, presence: true

  default_scope do
    order(offense_count: :desc)
  end

  def status
    case offense_count
    when 0
      :perfect
    when 1
      :acceptable
    when 2..3
      :warning
    when 4..5
      :dirty
    else
      :bad
    end
  end

  def content
    repository.git.object("#{revision.sha}:#{path}").contents
  end
end
