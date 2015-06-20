# Repository serializer
# @see Repository
class RevisionSerializer < ApplicationSerializer
  attributes :id, :sha, :message, :offense_count, :date, :status

  has_many :files

  link :url do
    api_revision_url(object.repository.owner, object.repository, object)
  end

  link :html_url do
    revision_url(object.repository.owner, object.repository, object)
  end


end
