require 'rails_helper'

RSpec.describe SyncRepositoriesJob, type: :job do
  let(:repo1) { double(:repo1, full_name: 'repo1', html_url: Faker::Internet.url) }
  describe '#load_github_repos' do
    let(:user) { create(:user) }
    it 'call the github api with the repos' do
      expect(user.github.client).to receive(:auto_paginate=).with(true)
      expect(user.github.client).to receive(:repos).with(user.username, type: :owner).and_return([])
      expect(user.github.client).to receive(:repos).with(user.username, type: :member).and_return([])
      subject.load_github_repos(user)
    end
  end

  describe '#find_or_create_repo' do
    let(:user) { create(:user) }
    context 'when repository is already added to the user' do
      let(:repo) { create(:repository, owner: user) }
      let(:github_repo) { double(full_name: repo.full_name) }

      it { expect(subject.find_or_create_repo(github_repo)).to eq(repo) }
    end

    context 'when repository is does not exists' do
      let(:repo) { create(:repository, owner: user) }
      let(:github_owner) { double(login: user.username) }
      let(:github_repo) do
        double(full_name: "#{user.username}/new_repo", name: 'new_repo', owner: github_owner)
      end

      it 'create a new repo' do
        repo = subject.find_or_create_repo(github_repo)
        expect(repo.name).to eq('new_repo')
        expect(repo.owner).to eq(user)
        expect(repo.full_name).to eq(github_repo.full_name)
      end
    end
  end
end
