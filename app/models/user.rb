# User model
class User < ActiveRecord::Base
  include FriendlyId

  friendly_id :username, use: [:finders]

  has_many :repos, class_name: 'Repository', dependent: :destroy, foreign_key: :owner_id

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
    user = new_from_omniauth(auth) if user.nil?
    if user.access_token != auth.credentials.token
      user.access_token = auth.credentials.token
      user.save
    end
    user
  end

  def self.new_from_omniauth(auth)
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
      data = session['devise.github_data']
      if data && session['devise.github_data']['extra']['raw_info']
        user.email = data['email'] if user.email.blank?
      end
    end
  end

  def self.find_or_create_owner(username)
    create_with(active: false).find_or_create_by(username: username)
  end

  # Get the github object using the user access token
  def github
    @github_api ||= GithubApi.new(access_token)
  end

  def gravatar_url
    "http://www.gravatar.com/avatar/#{Digest::MD5.hexdigest(email || '')}"
  end

  def to_s
    username
  end
end
