# Repository serializer
# @see Repository
# Rails.application.routes.default_url_options[:host] = '127.0.0.1:3000'
class UserSerializer < ApplicationSerializer
  attributes :id, :username

  link :url do
    api_user_url(object)
  end

  link :html_url do
    user_url(object)
  end

  link :repos_url do
    api_user_repos_url(object)
  end

  url [:user]
end
