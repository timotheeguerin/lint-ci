# Job that sync the user repositories
class SyncRepositoriesJob < ActiveJob::Base
  queue_as :default

  def perform(user)
    user.github.octokit.auto_paginate = true
    repos = user.github.octokit.repos(user.username, type: :all)
    repos.each do |github_repo|
      repo = find_or_create_repo(github_repo)
      repo.github_url = github_repo.html_url
      repo.save
      user.repositories << repo unless user.repositories.include?(repo)
    end
    user.save
    Channel.sync_repo(user).trigger(:completed, true)
  end

  def find_or_create_repo(github_repo)
    repo = Repository.find_by_full_name(github_repo.full_name)
    return repo unless repo.nil?

    repo = Repository.new
    repo.full_name = github_repo.full_name
    repo.name = github_repo.name
    repo.owner = User.find_or_create_owner(github_repo.owner.login)
    repo
  end
end
