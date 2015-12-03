# Revision model. Correspond to a commit
class Revision < ActiveRecord::Base
  include FriendlyId
  friendly_id :sha, use: [:finders]

  belongs_to :branch

  has_many :files, class_name: 'RevisionFile', dependent: :destroy
  has_many :linters, dependent: :destroy

  enum status: [:queued, :processing, :scanned]

  delegate :repository, to: :branch

  # If sha is nil it means it is currently queued.
  validates :sha, uniqueness: {scope: :branch_id}
  validates :branch_id, presence: true

  default_scope do
    order(created_at: :desc)
  end

  after_create do |revision|
    revision.channel.trigger(:create, revision.id)
  end

  after_update do |revision|
    revision.channel.trigger(:update, revision.id)
  end

  after_destroy do |revision|
    revision.channel.trigger(:destroy, revision.id)
  end

  def channel

    return if branch.nil?
    Channel.branch_revisions_change(branch.repository, branch)
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
    status.to_sym != :scanned
  end
end
