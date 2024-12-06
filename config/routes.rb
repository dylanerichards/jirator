Rails.application.routes.draw do
  root 'home#index'

  namespace :api do
    resources :jira_tickets, only: [:create]
    get 'config', to: 'config#index'
  end
end
