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

Rails.application.routes.draw do
  devise_for :users, controllers: {omniauth_callbacks: 'users/omniauth_callbacks'}
  root 'welcome#index'

  namespace :api do
    scope path: :v1, module: :v1 do
      draw :api_routes
    end
  end

  get ':id' => 'users#show', as: :user
  get ':user_id/:id' => 'repositories#show', as: :repository
  # Page showing the available badges as well as their url.
  get ':user_id/:id/badges' => 'repositories#badges', as: :repository_badges
  get ':user_id/:id/badge.svg' => 'repositories#badge', as: :repository_badge
  get ':user_id/:id/offense.svg' => 'repositories#badge_offense', as: :repository_offense_badge

  get ':user_id/:repository_id/:id' => 'revisions#show', as: :revision
  get ':user_id/:repository_id/:revision_id/:id/' => 'revision_files#show',
      as: :file, constraints: {id: /.+/}
end

