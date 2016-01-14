Channel.routes.draw do
  channel :sync_repo, 'user/:user/repos/sync' do |user_id|
    @user = User.find(user_id)
    authorize! :read, @user
  end

  channel :sync_branches, 'repos/:repo/branches/sync' do |repo_id|
    @repository = Repository.find(repo_id)
    authorize! :read, @repository
  end

  channel :branch_revisions_change, 'repos/:repo/:branch/revisions/change' do |repo_id, branch_id|
    @repository = Repository.find(repo_id)
    @branch = @repository.branches.find(branch_id)
    authorize! :read, @repository
    authorize! :read, @branch
  end

  channel :repo_revision_scan_update,
          'repos/:repo/:branch/revisions/:revision/scan' do |repo_id, branch_id, _|
    @repository = Repository.find(repo_id)
    @branch = @repository.branches.find(branch_id)
    authorize! :read, @repository
    authorize! :read, @branch
  end
end
