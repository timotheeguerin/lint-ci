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
    Github.octokit.repos(username, type: :all).each do |github_repo|
      next unless Repository.find_by_name(github_repo.name).nil?
      repository = repositories.build
      repository.name = github_repo.name
      repository.url = github_repo.html_url
    end
    save
  end
end
