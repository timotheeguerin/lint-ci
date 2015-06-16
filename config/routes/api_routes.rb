#================================================================
# Users
#================================================================
# Current user
get 'user' => 'current_user#show'

# List of all user
get 'users' => 'users#index'

# Get specific user
get 'users/:id' => 'users#show'

#================================================================
# Repositories
#================================================================
# Current user repositories
get 'user/repos' => 'current_user#current_repos', as: :current_user_repos

# List of all user repositories
get 'users/:user_id/repos' => 'repositories#index', as: :user_repos

# List of all user repositories
get 'repos/:user_id/:id' => 'repositories#show'


#================================================================
# Repositories Revisions
#================================================================
# List of all user repositories
get 'repos/:user_id/:repository_id/revisions' => 'revisions#index'

# List of all user repositories
get 'repos/:user_id/:repository_id/:id' => 'revisions#show'


#================================================================
# Repositories Revisions Files
#================================================================
# List of all user repositories
get 'repos/:user_id/:repository_id/:revision_id/files' => 'revision_files#index'

# List of all user repositories
get 'repos/:user_id/:repository_id/:revision_id/:id' => 'revision_files#show'


