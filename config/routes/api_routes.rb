get '' => 'welcome#index'

#================================================================
# Users
#================================================================
# Current user
get 'user' => 'current_user#show', as: :current_user

# List of all user
get 'users' => 'users#index', as: :users

# Get specific user
get 'users/:id' => 'users#show', as: :user

#================================================================
# Repositories
#================================================================
# Current user repositories
get 'user/repos' => 'current_user#current_repos', as: :current_user_repos

# Sync Repositories
post 'user/repos/sync' => 'current_user#sync_repos', as: :current_user_sync_repos

# List of all user repositories
get 'users/:user_id/repos' => 'repositories#index', as: :user_repos

# List of all user repositories
get 'repos/:user_id/:id' => 'repositories#show', as: :repo

# Refresh a repe(i.e trigger a new run to compute the style)
get 'repos/:user_id/:id/refresh' => 'repositories#refresh', as: :refresh_repo

#================================================================
# Repositories Revisions
#================================================================
# List of all user repositories
get 'repos/:user_id/:repository_id/revisions' => 'revisions#index', as: :revisions

# List of all user repositories
get 'repos/:user_id/:repository_id/:id' => 'revisions#show', as: :revision


#================================================================
# Repositories Revisions Files
#================================================================
# List of all files in revision
get 'repos/:user_id/:repository_id/:revision_id/files' => 'revision_files#index', as: :files

# List of all user repositories

#================================================================
# Repositories Revisions Files Offenses
#================================================================
get 'repos/:user_id/:repository_id/:revision_id/:revision_file_id/offenses' => 'offenses#index',
    as: :offenses, constraints: {revision_file_id: /.+/}
get 'repos/:user_id/:repository_id/:revision_id/:revision_file_id/offenses/:id' => 'offenses#show',
    as: :offense, constraints: {revision_file_id: /.+/}

get 'repos/:user_id/:repository_id/:revision_id/:id/content' => 'revision_files#content',
    as: :file_content, constraints: {id: /.+/}

get 'repos/:user_id/:repository_id/:revision_id/:id' => 'revision_files#show',
    as: :file, constraints: {id: /.+/}



