# User permissions
class Ability
  include CanCan::Ability

  def initialize(user)
    can [:read, :badge, :badges, :badge_offense, :content], :all

    return if user.nil?
    can :current, :all
    can :sync, Repository
    can [:enable, :disable, :refresh], Repository, memberships: {user_id: user.id}
  end
end
