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

post 'repos/:user/:repo/scan_webhook' => 'repositories#webhook', as: :repository_hook
#================================================================
# Repositories Branches
#================================================================
# Get
get 'repos/:user/:repo/branches' => 'branches#index', as: :branches

post 'repos/:user/:repo/branches/refresh' => 'branches#refresh', as: :sync_branches

# List
get 'repos/:user/:repo/:branch' => 'branches#show', as: :branch

# Scan
post 'repos/:user/:repo/:branch/scan' => 'branches#scan', as: :scan_branch

#================================================================
# Repositories Revisions
#================================================================
# List
get 'repos/:user/:repo/:branch/revisions' => 'revisions#index', as: :revisions

# Create
post 'repos/:user/:repo/:branch/revisions' => 'revisions#create'

# Get
get 'repos/:user/:repo/:branch/:revision' => 'revisions#show', as: :revision

# Delete
delete 'repos/:user/:repo/:branch/:revision' => 'revisions#destroy'

#================================================================
# Repositories Revisions Files
#================================================================
# List of all files in revision
get 'repos/:user/:repo/:branch/:revision/files' => 'revision_files#index', as: :files

# List of all user repositories

#================================================================
# Repositories Revisions Files Offenses
#================================================================
get 'repos/:user/:repo/:branch/:revision/:file/offenses' => 'offenses#index',
    as: :offenses
get 'repos/:user/:repo/:branch/:revision/:file/offenses/:offense' => 'offenses#show',
    as: :offense

get 'repos/:user/:repo/:branch/:revision/:file/content' => 'revision_files#content',
    as: :file_content

get 'repos/:user/:repo/:branch/:revision/:file' => 'revision_files#show',
    as: :file
