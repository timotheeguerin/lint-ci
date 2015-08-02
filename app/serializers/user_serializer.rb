# Repository serializer
# @see Repository
class UserSerializer < ApplicationSerializer
  cache key: 'user', expires_in: 3.hours

  attributes :id, :username

  link :url do
    api_user_url(object.username)
  end

  link :html_url do
    user_url(object.username)
  end

  link :repos_url do
    api_user_repos_url(object.username)
  end

  link :channels do
    {
      sync_repo: Channel.sync_repo_path(object.id)
    }
  end
end
