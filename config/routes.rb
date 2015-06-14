Rails.application.routes.draw do
  devise_for :users, controllers: {omniauth_callbacks: 'users/omniauth_callbacks'}

  root 'welcome#index'

  resources :repositories, only: [:index, :show]
  resources :revisions


  namespace :api do
    scope path: :v1, module: :v1 do
      resources :repositories, only: [:index, :show] do
        collection do
          post :sync
        end
        member do
          post :enable
          post :disable
          get :refresh
        end
        resources :revisions, only: [:index, :show] do
          resources :revision_files, only: [:index, :show], path: 'files'
        end
      end
    end
  end
end
