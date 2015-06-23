# Class containing repository
class Repository < ActiveRecord::Base
  extend FriendlyId
  friendly_id :name, use: [:finders]

  belongs_to :owner, class_name: 'User'

  has_many :memberships, dependent: :destroy
  has_many :users, through: :memberships

  has_many :revisions, dependent: :destroy

  validates :owner_id, presence: true
  validates :name, uniqueness: {scope: :owner_id}

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

  def status
    revision = revisions.last
    revision ? revision.status : :unavailable
  end

  def offense_count
    revision = revisions.last
    revision ? revision.offense_count : :unavailable
  end

  def badge_message
    status.to_s.capitalize
  end

  def badge_color
    badge_colors[status]
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
