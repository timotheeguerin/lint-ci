require 'rails_helper'

RSpec.describe BranchesController, type: :controller do

  let(:owner) { FactoryGirl.create(:user) }
  let(:repository) { FactoryGirl.create(:repository, owner: owner) }

  let(:collection_params) { {user: owner.username, repo: repository} }
  let(:params) { collection_params.merge(branch: branch.name) }

  describe 'GET #show' do
    let(:branch) { FactoryGirl.create(:branch, repository: repository) }
    before do
      get :show, params
    end

    it_behaves_like 'successful request'
  end
end
