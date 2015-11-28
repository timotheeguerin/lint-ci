# This is the background job that is going to update all the branches in the repository
class SyncBranchesJob < ActiveJob::Base
  queue_as :default

  # @param repository [Repository]
  def perform(user, repository)
    github_branches = load_github_branches(user, repository)

    remove_deleted_branches(repository, github_branches)
    github_branches.each do |branch|
      find_or_create_branch(repository, branch)
    end
    Channel.sync_branches(repository).trigger(:completed, true)
  end

  def remove_deleted_branches(repository, github_branches)
    repository.branches.where.not(name: github_branches.map(&:name)).destroy_all
  end

  def load_github_branches(user, repository)
    user.github.client.auto_paginate = true
    user.github.client.branches(repository.full_name)
  end

  def find_or_create_branch(repository, github_branch)
    branch = repository.branches.where(name: github_branch.name).first
    if branch.nil?
      branch = repository.branches.build(name: github_branch.name)
      branch.save
    end
  end
end
