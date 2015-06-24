require 'rails_helper'

RSpec.describe Api::V1::RepositoriesController do
  let(:owner) { FactoryGirl.create(:user) }
  describe 'GET #index' do
    before do
      get :index, user_id: owner.username
    end

    it { expect(response).to be_success }
    it { expect(response).to have_http_status(200) }
    it { expect(response).to return_json }

    it_has_behavior 'Pagination API', :index do
      let(:records) { FactoryGirl.create_list(:repository, 3, owner: owner) }
      let(:params) { {user_id: owner.username} }
    end

    describe 'filtering' do
      let!(:enabled_repo1) { create(:repository, owner: owner, enabled: true) }
      let!(:enabled_repo2) { create(:repository, owner: owner, enabled: true) }
      let!(:disabled_repo) { create(:repository, owner: owner, enabled: false) }

      it 'only retrieve all repos when filter not specified' do
        get :index, user_id: owner.username
        ids = json_response.map { |x| x[:id] }
        expect(ids).to eq([enabled_repo1.id, enabled_repo2.id, disabled_repo.id])
      end

      it 'only retrieve enabled repos' do
        get :index, user_id: owner.username, enabled: true
        ids = json_response.map { |x| x[:id] }
        expect(ids).to eq([enabled_repo1.id, enabled_repo2.id])
      end

      it 'only retrieve disabled repos' do
        get :index, user_id: owner.username, enabled: false
        ids = json_response.map { |x| x[:id] }
        expect(ids).to eq([disabled_repo.id])
      end

    end
  end

  describe 'GET #show' do
    let(:repository) { FactoryGirl.create(:repository, owner: owner) }
    before do
      get :show, id: repository.name, user_id: owner.username
    end

    it_behaves_like 'successful api request'
    it { expect(json_response[:id]).to eq(repository.id) }
    it { expect(json_response[:name]).to eq(repository.name) }
  end

  describe 'GET #enable' do
    when_user_signed_in do
      can :enable, Repository

      let!(:repository) { FactoryGirl.create(:repository, owner: owner) }
      before do
        allow(controller).to receive(:create_webhook)
        get :enable, id: repository.name, user_id: owner.username
      end

      it_behaves_like 'successful api request'
      it { expect(json_response[:id]).to eq(repository.id) }
      it { expect(json_response[:name]).to eq(repository.name) }
      it { expect(json_response[:enabled]).to be true }
      it { expect(controller).to have_received(:create_webhook) }
    end
  end

  describe 'GET #disable' do
    when_user_signed_in do
      can :disable, Repository

      let!(:repository) { FactoryGirl.create(:repository, owner: owner) }
      before do
        allow(controller).to receive(:delete_webhook)
        get :disable, id: repository.name, user_id: owner.username
      end

      it_behaves_like 'successful api request'
      it { expect(json_response[:id]).to eq(repository.id) }
      it { expect(json_response[:name]).to eq(repository.name) }
      it { expect(json_response[:enabled]).to be false }
      it { expect(controller).to have_received(:delete_webhook) }
    end
  end

  describe 'GET #refresh' do
    let!(:repository) { FactoryGirl.create(:repository, owner: owner, hook_id: hook_id) }
    before do
      allow(ScanRepositoryJob).to receive(:perform_later)
      get :refresh, id: repository.name, user_id: owner.username
    end
    context 'when repository is not refreshing' do
      let(:hook_id) { nil }

      it_behaves_like 'successful api request'
      it { expect(ScanRepositoryJob).not_to receive(:perform_later) }
      it { expect(json_response[:refreshing]).to be true }
    end

    context 'when repository is refreshing' do
      let(:hook_id) { 'some id' }

      it_behaves_like 'accepted api request'
      it { expect(ScanRepositoryJob).to receive(:perform_later).with(repository) }
      it { expect(json_response[:refreshing]).to be true }
      it { expect(repository.reload.hook_id).to eq(hook_id) }
    end
  end
end
