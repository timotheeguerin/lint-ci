# Repository serializer
# @see Repository
class RevisionFileSerializer < ApplicationSerializer
  attributes :id, :path, :offense_count, :status

  link :url do
    api_file_url(*args)
  end

  link :html_url do
    file_url(*args)
  end

  link :offenses_url do
    api_offenses_url(*args)
  end

  link :content_url do
    api_file_content_url(*args)
  end

  def args
    revision = object.revision
    branch = revision.branch
    repository = branch.repository
    [repository.owner, repository, branch, revision, object]
  end
end
