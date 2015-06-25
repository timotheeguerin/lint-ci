require 'rails_helper'

RSpec.describe RepositoriesController do
  let(:owner) { FactoryGirl.create(:user) }

  let(:collection_params) { {user: owner.username} }
  let(:params) { collection_params.merge(repo: repository.name) }

  describe 'GET #index' do
    before do
      get :index, collection_params
    end

    it_behaves_like 'successful request'
  end

  describe 'GET #show' do
    let(:repository) { FactoryGirl.create(:repository, owner: owner) }
    before do
      get :show, params
    end

    it_behaves_like 'successful request'
  end
end
