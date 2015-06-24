require 'rails_helper'

RSpec.describe Api::V1::UsersController do
  describe 'GET #index' do
    before do
      get :index
    end

    it { expect(response).to be_success }
    it { expect(response).to have_http_status(200) }
    it { expect(response).to return_json }

    context 'when more record than pagination allow' do
      let!(:users) { FactoryGirl.create_list(:user, 3) }

      it_paginate :index, :users
    end
  end

  describe 'GET #show' do
    before do
      @user = FactoryGirl.create(:user)
      get :show, id: @user.username
    end

    it { expect(response).to be_success }
    it { expect(response).to have_http_status(200) }
    it { expect(response).to return_json }
    it { expect(json_response[:id]).to eq(@user.id) }
    it { expect(json_response[:username]).to eq(@user.username) }
  end
end
