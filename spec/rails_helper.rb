# This file is copied to spec/ when you run 'rails generate rspec:install'
ENV['RAILS_ENV'] ||= 'test'
require 'spec_helper'
require File.expand_path('../../config/environment', __FILE__)
require 'rspec/rails'

module LintCI
  module Rspec
    # Helper methods to access in examples
    module Helper
      def json_response
        JSON.parse(response.body, symbolize_names: true)
      end
    end

    # Rspec custom macros
    module Macro
      def test_pagination(action, records, &params_block)
        let(:record_count) { send(records).size }
        let(:per_page) { record_count - 1 }
        if block_given?
          let(:pagination_params, &params_block)
        else
          let(:pagination_params) { {} }

        end

        it 'get first page' do
          get action, {per_page: per_page}.merge(pagination_params)
          expect(response).to return_json
          expect(json_response).to be_a Array
          expect(json_response.size).to eq(per_page)
        end

        it 'get second and last page' do
          get action, {per_page: per_page, page: 2}.merge(pagination_params)
          expect(response).to return_json
          expect(json_response).to be_a Array
          expect(json_response.size).to eq(record_count - per_page)
        end
      end

      def when_user_signed_in(&block)
        example_group_class = context 'when user is signed in' do
          let(:ability) { Object.new.extend(CanCan::Ability) }
          before do
            @request.env['devise.mapping'] = Devise.mappings[:user]
            @request.env['HTTP_REFERER'] = '/back'
            @user = FactoryGirl.create(:user)
            allow(controller).to receive(:current_ability).and_return(ability)
            sign_in @user
          end

          after do
            sign_out @user
            @user = nil
          end
        end
        example_group_class.class_eval &block
      end

      # Set an ability for the current user(To be used inside when_user_signed_in)
      def can(action, resource)
        before do
          ability.can action, resource
        end
      end

      def it_create_a(cls)
        tester = ControllerActionTester.new(self, :create, cls)
        tester
      end
    end
  end
end

RSpec::Matchers.define :return_json do
  match do |actual|
    begin
      JSON.parse(actual.body)
      true
    rescue JSON::ParserError
      false
    end
  end
end

ActiveRecord::Migration.maintain_test_schema!

RSpec.configure do |config|

  config.include FactoryGirl::Syntax::Methods
  config.include Devise::TestHelpers, type: :controller
  config.include LintCI::Rspec::Helper
  config.extend LintCI::Rspec::Macro, type: :controller
  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  config.use_transactional_fixtures = true

  # RSpec Rails can automatically mix in different behaviours to your tests
  # based on their file location, for example enabling you to call `get` and
  # `post` in specs under `spec/controllers`.
  #
  # You can disable this behaviour by removing the line below, and instead
  # explicitly tag your specs with their type, e.g.:
  #
  #     RSpec.describe UsersController, :type => :controller do
  #       # ...
  #     end
  #
  # The different available types are documented in the features, such as in
  # https://relishapp.com/rspec/rspec-rails/docs
  config.infer_spec_type_from_file_location!
end
