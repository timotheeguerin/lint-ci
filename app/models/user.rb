# User model
class User < ActiveRecord::Base
  include FriendlyId

  friendly_id :username, use: [:finders]

  has_many :memberships, dependent: :destroy
  has_many :repositories, through: :memberships

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable

  validates :username, presence: true, uniqueness: true

  def password_required?
    active? && (!persisted? || !password.nil? || !password_confirmation.nil?)
  end

  def email_required?
    active?
  end

  def self.from_omniauth(auth)
    user = where(provider: auth.provider, uid: auth.uid).first
    return user unless user.nil?
    user = User.find_or_create_by(username: auth.info.nickname)
    user.provider = auth.provider
    user.uid = auth.uid
    user.email = auth.info.email
    user.password = Devise.friendly_token[0, 20]
    user.active = true
    user.save
    user
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
      unless (repository = repositories.find_by_full_name(github_repo.full_name))
        repository = repositories.build
      end
      repository.name = github_repo.name
      repository.full_name = github_repo.full_name
      repository.owner = User.find_or_create_by(username: github_repo.owner.login)
      repository.github_url = github_repo.html_url
      repository.save
    end
    save
  end

  def to_s
    username
  end
end
