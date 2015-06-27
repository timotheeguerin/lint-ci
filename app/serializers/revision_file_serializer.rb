# Repository serializer
# @see Repository
class RevisionFileSerializer < ApplicationSerializer
  attributes :id, :path, :offense_count, :status

  link :url do
    api_file_url(object.repository.owner, object.repository, object.revision, object)
  end

  link :html_url do
    file_url(object.repository.owner, object.repository, object.revision, object)
  end

  link :offenses_url do
    api_offenses_url(object.repository.owner, object.repository, object.revision, object)
  end

  link :content_url do
    api_file_content_url(object.repository.owner, object.repository, object.revision, object)
  end
end
