# Revision model. Correspond to a commit
class Revision < ActiveRecord::Base
  include FriendlyId
  friendly_id :sha, use: [:finders]

  belongs_to :repository

  has_many :files, class_name: 'RevisionFile', dependent: :destroy
  has_many :linters, dependent: :destroy

  enum status: [:queued, :processing, :scanned]

  # If sha is nil it means it is currently queued.
  validates :sha, uniqueness: {scope: :repository_id}

  after_create do |revision|
    WebsocketRails['revisions/change'].trigger(:create, revision.id)
  end

  after_update do |revision|
    WebsocketRails['revisions/change'].trigger(:update, revision.id)
  end

  after_destroy do |revision|
    WebsocketRails['revisions/change'].trigger(:destroy, revision.id)
  end

  def style_status
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

  def scanning?
    status != :scanned
  end
end
