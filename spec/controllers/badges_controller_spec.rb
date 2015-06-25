require 'rails_helper'

RSpec.describe BadgesController do
  let(:owner) { FactoryGirl.create(:user) }
  let(:repository) { FactoryGirl.create(:repository, owner: owner) }

  let(:params) { {user: owner.username, repo: repository.name} }

  describe 'GET #index' do
    before do
      get :index, params
    end
    it_behaves_like 'successful request'
  end

  describe 'GET #quality' do
    let(:badge) { double(:quality_badge, file: 'some.svg') }

    before do
      allow(LintCI::Badge).to receive(:new).and_return(badge)
      allow(controller).to receive(:send_file) { controller.render nothing: true }
      get :quality, params
    end

    it_behaves_like 'successful request'

    it { expect(LintCI::Badge).to have_received(:new).with('Style', any_args) }
    it { expect(controller).to have_received(:send_file) }
  end

  describe 'GET #offense' do
    let(:badge) { double(:offense_badge, file: 'some.svg') }

    before do
      allow(LintCI::Badge).to receive(:new).and_return(badge)
      allow(controller).to receive(:send_file) { controller.render nothing: true }
      get :offense, params
    end

    it_behaves_like 'successful request'

    it { expect(LintCI::Badge).to have_received(:new).with('Offenses', any_args) }
    it { expect(controller).to have_received(:send_file) }
  end
end
