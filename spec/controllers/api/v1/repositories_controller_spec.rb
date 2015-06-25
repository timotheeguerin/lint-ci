require 'rails_helper'

RSpec.describe Api::V1::RepositoriesController do
  let(:owner) { FactoryGirl.create(:user) }

  let(:collection_params) { {user: owner.username} }
  let(:params) { collection_params.merge(repo: repository.name) }


  describe 'GET #index' do
    before do
      get :index, collection_params
    end

    it_behaves_like 'successful api request'

    it_has_behavior 'Pagination API', :index do
      let(:records) { FactoryGirl.create_list(:repository, 3, owner: owner) }
    end

    describe 'filtering' do
      let!(:enabled_repo1) { create(:repository, owner: owner, enabled: true) }
      let!(:enabled_repo2) { create(:repository, owner: owner, enabled: true) }
      let!(:disabled_repo) { create(:repository, owner: owner, enabled: false) }

      it 'only retrieve all repos when filter not specified' do
        get :index, collection_params
        ids = json_response.map { |x| x[:id] }
        expect(ids).to eq([enabled_repo1.id, enabled_repo2.id, disabled_repo.id])
      end

      it 'only retrieve enabled repos' do
        get :index, collection_params.merge(enabled: true)
        ids = json_response.map { |x| x[:id] }
        expect(ids).to eq([enabled_repo1.id, enabled_repo2.id])
      end

      it 'only retrieve disabled repos' do
        get :index, collection_params.merge(enabled: false)
        ids = json_response.map { |x| x[:id] }
        expect(ids).to eq([disabled_repo.id])
      end
    end
  end

  describe 'GET #show' do
    let(:repository) { FactoryGirl.create(:repository, owner: owner) }
    before do
      get :show, params
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
        get :enable, params
      end

      it_behaves_like 'successful api request'
      it { expect(json_response[:id]).to eq(repository.id) }
      it { expect(json_response[:name]).to eq(repository.name) }
      it { expect(json_response[:enabled]).to be true }
      it { expect(controller).to have_received(:create_webhook) }
    end

    when_user_signed_out do
      let!(:repository) { FactoryGirl.create(:repository, owner: owner) }

      before do
        get :refresh, params
      end
      it_behaves_like 'forbidden api request'
    end

    it_has_behavior 'require authorization', :refresh do
      let(:repository) { FactoryGirl.create(:repository, owner: owner) }
    end
  end

  describe 'GET #disable' do
    when_user_signed_in do
      can :disable, Repository

      let!(:repository) { FactoryGirl.create(:repository, owner: owner) }
      before do
        allow(controller).to receive(:delete_webhook)
        get :disable, params
      end

      it_behaves_like 'successful api request'
      it { expect(json_response[:id]).to eq(repository.id) }
      it { expect(json_response[:name]).to eq(repository.name) }
      it { expect(json_response[:enabled]).to be false }
      it { expect(controller).to have_received(:delete_webhook) }
    end

    it_has_behavior 'require authorization', :refresh do
      let(:repository) { FactoryGirl.create(:repository, owner: owner) }
    end
  end

  describe 'GET #refresh' do
    when_user_signed_in do
      can :refresh, Repository
      let(:job) { double(:job, job_id: 'some id') }
      let!(:repository) { FactoryGirl.create(:repository, owner: owner, job_id: job_id) }

      before do
        allow(ScanRepositoryJob).to receive(:perform_later).and_return(job)
        get :refresh, params
        repository.reload
      end

      context 'when repository is not refreshing' do
        let(:job_id) { nil }

        it_behaves_like 'accepted api request'
        it { expect(ScanRepositoryJob).to have_received(:perform_later).with(repository) }
        it { expect(repository.job_id).to eq(job.job_id) }
        it { expect(json_response[:refreshing]).to be true }
      end

      context 'when repository is refreshing' do
        let(:job_id) { 'some existing id' }

        it_behaves_like 'successful api request'
        it { expect(ScanRepositoryJob).not_to receive(:perform_later) }
        it { expect(repository.job_id).to eq(job_id) }
        it { expect(json_response[:refreshing]).to be true }
      end
    end

    it_has_behavior 'require authorization', :refresh do
      let(:repository) { FactoryGirl.create(:repository, owner: owner) }
    end
  end
end
