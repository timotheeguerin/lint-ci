Rails.application.routes.draw do
  devise_for :users, controllers: {omniauth_callbacks: 'users/omniauth_callbacks'}

  root 'welcome#index'

  resources :repositories, only: [:index, :show] do
    collection do
      get :sync
    end
    member do
      post :enable
      post :disable
    end
  end

  resources :revisions
end
