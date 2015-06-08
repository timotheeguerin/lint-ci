# Repositories Api controller
class RepositoriesController < ApplicationController
  load_and_authorize_resource

  def index
    respond_to do |format|
      format.html

      format.json do
        render 'index.jbuilder'
      end
    end
  end

  def show

  end

  def sync
    current_user.sync_repositories
    render 'index.jbuilder'
  end

  def enable
    @repository.enabled = true
    @repository.save
    render 'show.jbuilder'
  end

  def disable
    @repository.enabled = false
    @repository.save
    render 'show.jbuilder'
  end

  private

  def query_params
    params.permit(:name)
  end

  def init
    @repository = Repository.new
    @repositories  = Repository.empty
  end
end
