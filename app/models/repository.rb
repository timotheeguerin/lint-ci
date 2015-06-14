# Class containing repository
class Repository < ActiveRecord::Base
  has_many :memberships, dependent: :destroy
  has_many :users, through: :memberships

  has_many :revisions

  def owner_path
    File.join(LintCI.repositories_root, owner)
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
end
