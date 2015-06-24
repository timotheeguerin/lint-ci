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

    context 'when more record than pagination allow' do
      let!(:repos) { FactoryGirl.create_list(:repository, 3, owner: owner) }

      test_pagination(:index, :repos) { {user_id: owner.username} }
    end
  end

  describe 'GET #show' do
    let(:repository) { FactoryGirl.create(:repository, owner: owner) }
    before do
      get :show, id: repository.name, user_id: owner.username
    end

    it { expect(response).to be_success }
    it { expect(response).to have_http_status(200) }
    it { expect(response).to return_json }
    it { expect(json_response[:id]).to eq(repository.id) }
    it { expect(json_response[:name]).to eq(repository.name) }
  end

  describe 'GET #enable' do
    when_user_signed_in do
      # can :enable, Repository
      can :manage, :all

      let!(:repository) { FactoryGirl.create(:repository, owner: owner) }
      before do
        allow(controller).to receive(:create_webhook)
        get :enable, id: repository.name, user_id: owner.username
      end

      it { expect(response).to be_success }
      it { expect(response).to have_http_status(200) }
      it { expect(response).to return_json }
      it { expect(json_response[:id]).to eq(repository.id) }
      it { expect(json_response[:name]).to eq(repository.name) }
      it { expect(json_response[:enabled]).to be true }
      it { expect(controller).to have_received(:create_webhook) }
    end
  end
end
