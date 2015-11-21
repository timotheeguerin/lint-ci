# Job that sync the user repositories
class SyncRepositoriesJob < ActiveJob::Base
  queue_as :default

  def perform(user)
    repos = load_github_repos(user)
    save_repos(user, repos)
    Channel.sync_repo(user).trigger(:completed, true)
  end

  def load_github_repos(user)
    user.github.client.auto_paginate = true
    user.github.client.repos(user.username, type: :all)
  end

  def save_repos(user, repos)
    repos.each do |github_repo|
      update_repo(user, github_repo)
    end
    user.save
  end

  def update_repo(user, github_repo)
    repo = find_or_create_repo(github_repo)
    repo.github_url = github_repo.html_url
    repo.save
    user.repositories << repo unless user.repositories.include?(repo)
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
