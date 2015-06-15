# Class containing repository
class Repository < ActiveRecord::Base
  extend FriendlyId
  friendly_id :name, use: [:finders]

  belongs_to :owner, class_name: 'User'

  has_many :memberships, dependent: :destroy
  has_many :users, through: :memberships

  has_many :revisions

  def owner_path
    File.join(LintCI.repositories_path, owner.username)
  end

  def local_path
    File.join(owner_path, name)
  end

  # @return Git object
  def git
    if File.directory?(File.join(local_path, '.git'))
      Git.open(local_path)
    else
      FileUtils.mkdir_p(owner_path)
      Git.clone(github_url, name, path: owner_path)
    end
  end

  def status
    revision = revisions.last
    revision ? revision.status : :unavailable
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
     unavailable: 'lightgray'
    }
  end
end
