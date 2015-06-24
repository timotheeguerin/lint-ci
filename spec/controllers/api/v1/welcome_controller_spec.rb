require 'rails_helper'

RSpec.describe Api::V1::WelcomeController do
  describe 'GET #index' do
    before do
      get :index
    end

    it { expect(response).to be_success }
    it { expect(response).to have_http_status(200) }
    it { expect(response).to return_json }
  end
end
