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
    owned = user.github.client.repos(user.username, type: :owner)
    owned + user.github.client.repos(user.username, type: :member)
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
    create_default_branch(repo, github_repo)
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

  def create_default_branch(repo, github_repo)
    branch = repo.branches.find_by_name(github_repo.default_branch)
    if branch.nil?
      branch = repo.branches.build
      branch.name = github_repo.default_branch
      branch.save
    end
    branch
  end
end
