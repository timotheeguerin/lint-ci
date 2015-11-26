require 'rails_helper'

RSpec.describe Api::V1::RevisionsController do
  let(:owner) { FactoryGirl.create(:user) }
  let(:repository) { FactoryGirl.create(:repository, owner: owner) }
  let(:branch) { FactoryGirl.create(:branch, repository: repository) }

  let(:collection_params) { {user: owner.username, repo: repository.name, branch: branch} }
  let(:params) { collection_params.merge(revision: revision.sha) }

  describe 'GET #index' do
    before do
      get :index, collection_params
    end

    it { expect(response).to be_success }
    it { expect(response).to have_http_status(200) }
    it { expect(response).to return_json }

    it_has_behavior 'Pagination API', :index do
      let(:records) { FactoryGirl.create_list(:revision, 3, branch: branch).reverse }
    end
  end

  describe 'GET #show' do
    let(:revision) { FactoryGirl.create(:revision, branch: branch) }
    before do
      get :show, params
    end

    it_behaves_like 'successful api request'
    it { expect(json_response[:id]).to eq(revision.id) }
    it { expect(json_response[:sha]).to eq(revision.sha) }
  end
end
