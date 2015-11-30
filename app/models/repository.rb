class Repository < ActiveRecord::Base
# Class containing repository
  extend FriendlyId
  friendly_id :name, use: [:finders]

  belongs_to :owner, class_name: 'User'

  has_many :memberships, dependent: :destroy
  has_many :users, through: :memberships

  has_many :branches, dependent: :destroy

  validates :owner_id, presence: true
  validates :name, uniqueness: {scope: :owner_id}

  default_scope do
    includes(:owner)
  end

  before_create do
    self.last_sync_at = created_at
  end

  def default_branch
    if branches.empty?
      branch = branches.build(name: 'master')
      branch.save
      branch
    else
      branches.where(name: 'master').first || branches.first
    end
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
    default_branch.style_status
  end

  # Get the current number of offense in the latest revision of the default branch
  # If the branch has never been scanned it will return unavailable.
  def offense_count
    default_branch.offense_count
  end

  def refreshing
    !job_id.nil?
  end
end
