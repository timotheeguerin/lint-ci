# User model
class User < ActiveRecord::Base
  has_many :memberships, dependent: :destroy
  has_many :repositories, through: :memberships

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0, 20]
      user.username = auth.info.nickname
    end
  end

  def self.new_with_session(_params, session)
    super.tap do |user|
      if (data = session['devise.github_data']) && session['devise.github_data']['extra']['raw_info']
        user.email = data['email'] if user.email.blank?
      end
    end
  end

  # Sync the user project with github
  def sync_repositories
    GithubApi.octokit.repos(username, type: :all).each do |github_repo|
      repository = repositories.find_by_full_name(github_repo.full_name)
      repository = repositories.build if repositories.nil?
      repository.name = github_repo.name
      repository.full_name = github_repo.full_name
      repository.owner = github_repo.owner.login
      repository.github_url = github_repo.html_url
      repository.save
    end
    save
  end
end
