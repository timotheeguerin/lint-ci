require 'rails_helper'

RSpec.describe Api::V1::OffensesController do
  let(:owner) { FactoryGirl.create(:user) }
  let(:repository) { FactoryGirl.create(:repository, owner: owner) }
  let(:branch) { FactoryGirl.create(:branch, repository: repository) }
  let(:revision) { FactoryGirl.create(:revision, branch: branch) }
  let(:file) { FactoryGirl.create(:revision_file, revision: revision) }
  let(:collection_params) do
    {user: owner.username,
     repo: repository.name,
     branch: branch.name,
     revision: revision.sha,
     file: file.path}
  end
  let(:params) { collection_params.merge(offense: offense.id) }

  describe 'GET #index' do
    before do
      get :index, collection_params
    end

    it { expect(response).to be_success }
    it { expect(response).to have_http_status(200) }
    it { expect(response).to return_json }

    it_has_behavior 'Pagination API', :index do
      let(:records) { FactoryGirl.create_list(:offense, 3, file: file) }
    end
  end

  describe 'GET #show' do
    let(:offense) { FactoryGirl.create(:offense, file: file) }

    before do
      get :show, params
    end

    it_behaves_like 'successful api request'
    it { expect(json_response[:id]).to eq(offense.id) }
    it { expect(json_response[:message]).to eq(offense.message) }
  end
end
