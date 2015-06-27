# Revision serializer
# @see Revision
class RevisionSerializer < ApplicationSerializer
  attributes :id, :sha, :message, :offense_count, :date, :status

  has_many :linters

  link :url do
    api_revision_url(object.repository.owner, object.repository, object)
  end

  link :html_url do
    revision_url(object.repository.owner, object.repository, object)
  end

  link :files_url do
    api_files_url(object.repository.owner, object.repository, object)
  end
end
