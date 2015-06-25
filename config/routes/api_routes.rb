get '' => 'welcome#index'

#================================================================
# Users
#================================================================
# Current user
get 'user' => 'current_user#show', as: :current_user

# List of all user
get 'users' => 'users#index', as: :users

# Get specific user
get 'users/:user' => 'users#show', as: :user

#================================================================
# Repositories
#================================================================
# Current user repositories
get 'user/repos' => 'current_user#current_repos', as: :current_user_repos

# Sync Repositories
post 'user/repos/sync' => 'current_user#sync_repos', as: :current_user_sync_repos

# List of all user repositories
get 'users/:user/repos' => 'repositories#index', as: :user_repos


# Get specific repo
get 'repos/:user/:repo' => 'repositories#show', as: :repo

# Enable a specific repository
post 'repos/:user/:repo/enable' => 'repositories#enable', as: :enable_repo

# Disable a specific repository
post 'repos/:user/:repo/disable' => 'repositories#disable', as: :disable_repo

# Refresh a repe(i.e trigger a new run to compute the style)
post 'repos/:user/:repo/refresh' => 'repositories#refresh', as: :refresh_repo

#================================================================
# Repositories Revisions
#================================================================
# List of all user repositories
get 'repos/:user/:repo/revisions' => 'revisions#index', as: :revisions

post 'repos/:user/:repo/revisions/webhook' => 'revisions#webhook', as: :revisions_hook


# List of all user repositories
get 'repos/:user/:repo/:revision' => 'revisions#show', as: :revision


#================================================================
# Repositories Revisions Files
#================================================================
# List of all files in revision
get 'repos/:user/:repo/:revision/files' => 'revision_files#index', as: :files

# List of all user repositories

#================================================================
# Repositories Revisions Files Offenses
#================================================================
get 'repos/:user/:repo/:revision/:file/offenses' => 'offenses#index',
    as: :offenses
get 'repos/:user/:repo/:revision/:file/offenses/:offense' => 'offenses#show',
    as: :offense

get 'repos/:user/:repo/:revision/:file/content' => 'revision_files#content',
    as: :file_content

get 'repos/:user/:repo/:revision/:file' => 'revision_files#show',
    as: :file
