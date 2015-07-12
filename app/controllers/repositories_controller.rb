# Repo controller
class RepositoriesController < ApplicationController
  include ActionController::Live

  load_and_auth_repository parents: true

  def show
  end

  private

  def query_params
    params.permit(:name)
  end

  def init
    @repository = Repository.new
    @repositories = Repository.empty
  end
end
