require 'rails_helper'

RSpec.describe Api::V1::BranchesController, type: :controller do
  let(:owner) { FactoryGirl.create(:user) }
  let(:repository) { FactoryGirl.create(:repository, owner: owner) }

  let(:collection_params) { {user: owner.username, repo: repository.name} }
  let(:params) { collection_params.merge(branch: branch.name) }

  describe 'GET #scan' do
    when_user_signed_in do
      can :scan, Branch
      let!(:branch) { FactoryGirl.create(:branch, repository: repository) }
      let(:scanner) { double(:scanner, scan: queue) }

      before do
        allow(RevisionScan).to receive(:new).and_return(scanner)
        get :scan, params
        repository.reload
      end

      context 'when scanner queue the revision' do
        let(:queue) { true }

        it_behaves_like 'accepted api request'
        it { expect(scanner).to have_received(:scan).with(no_args) }
      end

      context 'when repository is refreshing' do
        let(:queue) { false }

        it_behaves_like 'successful api request'
        it { expect(scanner).to have_received(:scan).with(no_args) }
      end
    end

    it_has_behavior 'require authorization', :refresh do
      let(:branch) { FactoryGirl.create(:branch, repository: repository) }
    end
  end
end
