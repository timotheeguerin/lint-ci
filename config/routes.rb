# Add a draw method inside the mapper
class ActionDispatch::Routing::Mapper
  def draw(name)
    filename = Rails.root.join("config/routes/#{name}.rb")
    unless File.exist? filename
      msg = "Your router tried to #draw the external file #{name}.rb,\n"
      msg << "but the file was not found at #{filename}\n"
      fail ArgumentError, msg
    end
    instance_eval(File.read(filename))
  end
end
# Sidekiq cancan auth
class CanCanConstraint
  def initialize(action, resource)
    @action = action
    @resource = resource
  end

  def matches?(request)
    return false if request.env['warden'].nil?
    current_user = request.env['warden'].user
    ability = Ability.new(current_user)
    ability.can?(@action, @resource)
  end
end

# General constraints
module LintCI::Constraints
  class << self
    # Allow repository to contain .
    def repository
      {repo: %r{[^/]+}}
    end

    # Allow file to have multiple segments and contain .
    def file
      {file: /.+/}
    end

    def all
      repository.merge(file)
    end
  end
end

require 'sidekiq/web'

Rails.application.routes.draw do
  # Allow :repo, :file to be more than the regular format.
  constraints LintCI::Constraints.all do

    get 'settings/repositories'


    devise_for :users, controllers: {omniauth_callbacks: 'users/omniauth_callbacks'}

    scope path: '/admin' do
      mount Sidekiq::Web => '/sidekiq', constraints: CanCanConstraint.new(:manage, :sidekiq)
    end

    root 'welcome#index'


    namespace :api do
      scope path: :v1, module: :v1 do
        draw :api_routes
      end
    end

    get 'settings' => 'settings#index', as: :user_settings
    get 'settings/repositories' => 'settings#repositories', as: :user_repo_settings

    get ':user' => 'users#show', as: :user

    constraints LintCI::Constraints.repository do
      get ':user/:repo' => 'repositories#show', as: :repository
      # Page showing the available badges as well as their url.
      get ':user/:repo/badges' => 'badges#index', as: :repository_badges

      get ':user/:repo/badge.svg' => 'badges#quality', as: :repository_badge

      get ':user/:repo/offense.svg' => 'badges#offense', as: :repository_offense_badge

      get ':user/:repo/:revision' => 'revisions#show', as: :revision

      get ':user/:repo/:revision/:file/' => 'revision_files#show',
          as: :file, constraints: LintCI::Constraints.file
    end
  end
end

