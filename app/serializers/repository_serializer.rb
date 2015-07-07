# Repository serializer
# @see Repository
class RepositorySerializer < ApplicationSerializer
  attributes :id, :name, :owner, :full_name, :enabled, :github_url, :refreshing,
             :style_status, :offense_count, :last_sync_at

  belongs_to :owner

  link :url do
    api_repo_url(object.owner, object)
  end

  link :html_url do
    repository_url(object.owner, object)
  end

  link :badges_url do
    repository_badges_url(object.owner, object)
  end

  link :badge_url do
    repository_badge_url(object.owner, object)
  end

  link :offense_badge_url do
    repository_offense_badge_url(object.owner, object)
  end

  link :revisions_url do
    api_revisions_url(object.owner, object)
  end

  link :refresh_url do
    api_refresh_repo_url(object.owner, object)
  end

  link :enable_url do
    api_enable_repo_url(object.owner, object)
  end


  link :disable_url do
    api_disable_repo_url(object.owner, object)
  end
end
