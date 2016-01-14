# Revision serializer
# @see Revision
class RevisionSerializer < ApplicationSerializer
  attributes :id, :sha, :message, :offense_count, :date, :status, :style_status

  has_many :linters

  link :url do
    api_revision_url(*args)
  end

  link :html_url do
    revision_url(*args)
  end

  link :files_url do
    api_files_url(*args)
  end

  link :channels do
    {
      scan_update: Channel.repo_revision_scan_update_path(object.branch.repository,
                                                          object.branch, object)
    }
  end

  def args
    branch = object.branch
    repository = branch.repository
    [repository.owner, repository, branch, object]
  end
end
