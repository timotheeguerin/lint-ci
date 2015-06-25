require 'rails_helper'

RSpec.describe UsersController do
  describe 'GET #show' do
    let(:user) { FactoryGirl.create(:user) }
    before do
      get :show, user: user.username
    end

    it_behaves_like 'successful request'
  end
end
