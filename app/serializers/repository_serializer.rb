# Repository serializer
# @see Repository
class RepositorySerializer < ApplicationSerializer
  attributes :id, :name, :owner, :full_name, :enabled,  :github_url


  url :repository
end
