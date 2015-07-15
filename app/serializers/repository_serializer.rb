# Repository serializer
# @see Repository
class RepositorySerializer < ApplicationSerializer
  cache key: 'post', expires_in: 3.hours

  attributes :id, :name, :owner, :full_name, :enabled, :github_url, :refreshing,
             :style_status, :offense_count, :last_sync_at

  belongs_to :owner

  # link :links do
  #   {
  #     url: api_repo_url(object.owner.username, object.name),
  #     html_url: repository_url(object.owner.username, object.name),
  #     badges_url: repository_badges_url(object.owner.username, object.name),
  #     offense_badge_url: repository_offense_badge_url(object.owner.username, object.name),
  #     revisions_url: api_revisions_url(object.owner.username, object.name),
  #     refresh_url: api_refresh_repo_url(object.owner.username, object.name),
  #     enable_url: api_enable_repo_url(object.owner.username, object.name),
  #     disable_url: api_disable_repo_url(object.owner.username, object.name)
  #   }
  # end
  link :url do
    api_repo_url(object.owner.username, object.name)
  end

  link :html_url do
    repository_url(object.owner.username, object.name)
  end

  link :badges_url do
    repository_badges_url(object.owner.username, object.name)
  end

  link :badge_url do
    repository_badge_url(object.owner.username, object.name)
  end

  link :offense_badge_url do
    repository_offense_badge_url(object.owner.username, object.name)
  end

  link :revisions_url do
    api_revisions_url(object.owner.username, object.name)
  end

  link :refresh_url do
    api_refresh_repo_url(object.owner.username, object.name)
  end

  link :enable_url do
    api_enable_repo_url(object.owner.username, object.name)
  end

  link :disable_url do
    api_disable_repo_url(object.owner.username, object.name)
  end

  link :channels do
    {
      revision_changes: Channel.repo_revisions_change_path(object.id)
    }
  end
end
