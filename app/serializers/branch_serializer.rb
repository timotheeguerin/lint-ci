# Branch serializer
# @see Branch
class BranchSerializer < ApplicationSerializer

  attributes :id, :name, :repository_id

  belongs_to :repository

  link :url do
    api_branch_url(*args)
  end

  link :html_url do
    branch_url(*args)
  end

  link :revisions_url do
    api_revisions_url(*args)
  end

  link :scan_url do
    api_scan_branch_url(*args)
  end

  link :badge_url do
    repository_badge_url(object.repository.owner.username, object.repository.name,
                         branch: object.name)
  end

  link :offense_badge_url do
    repository_offense_badge_url(object.repository.owner.username, object.repository.name,
                                 branch: object.name)
  end

  link :channels do
    {
      revision_changes: Channel.branch_revisions_change_path(object.repository.id, object.id)
    }
  end

  def args
    [object.repository.owner.username, object.repository.name, object.name]
  end
end
