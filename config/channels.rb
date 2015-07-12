Channel.routes.draw do
  channel :repo_revisions_change, 'repos/:repo/revisions/change' do |repo_id|
    @repository = Repository.find(repo_id)
    authorize! :read, @repository
  end

  channel :repo_revision_scan_update, 'repos/:repo/revisions/:revision/scan' do |repo_id, _|
    @repository = Repository.find(repo_id)
    authorize! :read, @repository
  end
end
