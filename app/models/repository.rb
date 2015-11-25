class Repository < ActiveRecord::Base
# Class containing repository
  extend FriendlyId
  friendly_id :name, use: [:finders]

  belongs_to :owner, class_name: 'User'

  has_many :memberships, dependent: :destroy
  has_many :users, through: :memberships

  has_many :branches, dependent: :destroy

  has_one :current_revision, class_name: 'Revision'

  validates :owner_id, presence: true
  validates :name, uniqueness: {scope: :owner_id}

  default_scope do
    includes(:current_revision, :owner)
  end

  before_create do
    self.last_sync_at = created_at
  end

  def default_branch
    branches.where(name: 'master').first || branches.first
  end

  def owner_path
    File.join(LintCI.repositories_path, owner.username)
  end

  def local_path
    File.join(owner_path, name)
  end

  # @return Git object
  def git
    if File.directory?(File.join(local_path, '.git'))
      logger.info "#{full_name} repository already cloned."
      Git.open(local_path)
    else
      logger.info "Cloning repository #{full_name}"
      FileUtils.mkdir_p(owner_path)
      Git.clone(github_url, name, path: owner_path)
    end
  end

  def style_status
    revision = current_revision
    revision ? revision.style_status : :unavailable
  end

  def offense_count
    revision = current_revision
    revision ? revision.offense_count : :unavailable
  end

  def badge_message
    style_status.to_s.capitalize
  end

  def badge_color
    badge_colors[style_status]
  end

  def badge_colors
    {perfect: 'brightgreen',
     great: 'green',
     good: 'yellowgreen',
     acceptable: 'yellowgreen',
     warning: 'yellow',
     dirty: 'orange',
     bad: 'red',
     unavailable: 'lightgray'}
  end

  def refreshing
    !job_id.nil?
  end
end
