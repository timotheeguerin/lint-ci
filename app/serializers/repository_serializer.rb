# Repository serializer
# @see Repository
class RepositorySerializer < ApplicationSerializer
  cache key: 'post', expires_in: 3.hours

  attributes :id, :name, :owner, :full_name, :enabled, :github_url, :refreshing,
             :style_status, :offense_count, :last_sync_at

  belongs_to :owner
  has_one :default_branch

  link :url do
    api_repo_url(*args)
  end

  link :html_url do
    repository_url(*args)
  end

  link :badges_url do
    repository_badges_url(*args)
  end

  link :branches_url do
    api_branches_url(*args)
  end

  link :enable_url do
    api_enable_repo_url(*args)
  end

  link :disable_url do
    api_disable_repo_url(*args)
  end

  link :sync_branches_url do
    api_sync_branches_url(*args)
  end

  link :channels do
    {
      sync_branches: Channel.sync_branches_path(object.id)
    }
  end

  def args
    [object.owner.username, object.name]
  end
end
