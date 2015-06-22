require 'rails_helper'

RSpec.describe SettingsController, type: :controller do

  describe "GET #repositories" do
    it "returns http success" do
      get :repositories
      expect(response).to have_http_status(:success)
    end
  end

end
