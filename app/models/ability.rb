# User permissions
class Ability
  include CanCan::Ability

  def initialize(user)
    can :read, :all
    return if user.nil?
    can :sync, Repository
    can [:enable, :disable], Repository, memberships: {user_id: user.id}
  end
end
