# Repositories Api controller
class RepositoriesController < ApplicationController
  load_and_auth_repository parents: true

  def index
  end

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
