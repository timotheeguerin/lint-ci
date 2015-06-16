# Repository serializer
# @see Repository
# Rails.application.routes.default_url_options[:host] = '127.0.0.1:3000'
class UserSerializer < ApplicationSerializer
  attributes :id, :username, :repos_url

  def repos_url
    api_user_repos_url(object)
  end

  def url_options
    @options[:url_options] || {}
  end
  url [:user]
end
