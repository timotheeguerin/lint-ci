# Repository serializer
# @see Repository
class RepositorySerializer < ApplicationSerializer
  attributes :id, :name, :enabled

  def github_url
    object.url
  end

  def url
    repository_url(object)
  end
end
