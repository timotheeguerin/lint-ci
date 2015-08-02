Channel.routes.draw do
  channel :sync_repo, 'user/:user/repos/sync' do |user_id|
    @user = User.find(user_id)
    authorize! :read, @user
  end

  channel :repo_revisions_change, 'repos/:repo/revisions/change' do |repo_id|
    @repository = Repository.find(repo_id)
    authorize! :read, @repository
  end

  channel :repo_revision_scan_update, 'repos/:repo/revisions/:revision/scan' do |repo_id, _|
    @repository = Repository.find(repo_id)
    authorize! :read, @repository
  end
end
