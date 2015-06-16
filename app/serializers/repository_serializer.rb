# Repository serializer
# @see Repository
class RepositorySerializer < ApplicationSerializer
  attributes :id, :name, :owner, :full_name, :enabled, :github_url, :badge_url, :offense_badge_url

  def badge_url
    repository_badge_url(object.owner, object)
  end

  def offense_badge_url
    repository_offense_badge_url(object.owner, object)
  end
end
