# User permissions
class Ability
  include CanCan::Ability

  def initialize(user)
    can :revision_change, :all
    alias_action :enable, :disable, :refresh, :sync, to: :update

    can [:read, :badge, :badges, :badge_offense, :content], :all

    return if user.nil?
    can :current, :all
    can :sync, Repository
    can [:enable, :disable, :refresh], Repository, memberships: {user_id: user.id}
    
    if user.admin?
      can :manage, :sidekiq
    end
  end
end
