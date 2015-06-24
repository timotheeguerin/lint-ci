require 'rails_helper'

RSpec.describe Api::V1::UsersController do
  describe 'GET #index' do
    before do
      get :index
    end
    it_behaves_like 'successful api request'

    it_has_behavior 'Pagination API', :index do
      let(:records) { FactoryGirl.create_list(:user, 3) }
      let(:params) { {} }
    end
  end

  describe 'GET #show' do
    before do
      @user = FactoryGirl.create(:user)
      get :show, id: @user.username
    end

    it_behaves_like 'successful api request'

    it { expect(json_response[:id]).to eq(@user.id) }
    it { expect(json_response[:username]).to eq(@user.username) }
  end
end
