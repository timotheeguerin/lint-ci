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

    it_has_behavior 'require authorization', :enable do
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

    it_has_behavior 'require authorization', :disable do
      let(:repository) { FactoryGirl.create(:repository, owner: owner) }
    end
  end
end
