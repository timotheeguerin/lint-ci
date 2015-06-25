require 'rails_helper'

RSpec.describe Api::V1::RevisionsFileController do
  let(:owner) { FactoryGirl.create(:user) }
  let(:repository) { FactoryGirl.create(:repository, owner: owner) }
  let(:revision) { FactoryGirl.create(:revision, repository: repository) }
  let(:collection_params) { {user: owner.username, repo: repository.name, revision: revision.sha} }
  let(:params) { collection_params.merge(file: file.path) }

  describe 'GET #index' do
    before do
      get :index, collection_params
    end

    it { expect(response).to be_success }
    it { expect(response).to have_http_status(200) }
    it { expect(response).to return_json }

    it_has_behavior 'Pagination API', :index do
      let(:records) { FactoryGirl.create_list(:revision_file, 3, repository: repository) }
    end
  end

  describe 'GET #show' do
    let(:file) { FactoryGirl.create(:revision_file, revision: revision) }
    before do
      get :show, params
    end

    it_behaves_like 'successful api request'
    it { expect(json_response[:id]).to eq(file.id) }
    it { expect(json_response[:sha]).to eq(file.path) }
  end

  describe 'GET #content' do
    let(:file) { FactoryGirl.create(:revision_file, revision: revision) }
    let(:content) { FactoryGirl::Lorem.paragraph }
    let(:highlighter) { double(:highlighter, highlight: content) }
    before do
      allow(LintCI::Highlighter).to receive(:new).and_return(highlighter)
      get :content, params
    end

    it_behaves_like 'successful api request'
    it { expect(LintCI::Highlighter).to have_received(:new) }
    it { expect(highlighter).to have_received(:highlight) }
    it { expect(json_response[:highlighted]).to eq(content) }
  end
end
