# Branch serializer
# @see Branch
class BranchSerializer < ApplicationSerializer

  attributes :id, :name, :repository_id

  belongs_to :repository

  link :url do
    api_branch_url(object.repository.owner.username, object.repository.name, object.name)
  end

  link :html_url do
    branch_url(object.repository.owner.username, object.repository.name, object.name)
  end

  link :revisions_url do
    api_revisions_url(object.repository.owner.username, object.repository.name, object.name)
  end

  link :scan_url do
    api_scan_branch_url(object.repository.owner.username, object.repository.name, object.name)
  end

  link :channels do
    {
      revision_changes: Channel.branch_revisions_change_path(object.repository.id, object.id)
    }
  end
end
