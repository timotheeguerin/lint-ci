# Repository serializer
# @see Repository
class RepositorySerializer < ApplicationSerializer
  attributes :id, :name, :enabled,  :github_url


  url :repository
end
