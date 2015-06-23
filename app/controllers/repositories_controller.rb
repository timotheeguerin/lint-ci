# Repositories Api controller
class RepositoriesController < ApplicationController
  resource [:user, :repository]

  def index
  end

  def show
  end

  def badges

  end

  def badge
    badge = LintCI::Badge.new('Style', @repository.badge_message,
                              @repository.badge_color,
                              params.except(:action))
    send_file badge.file, disposition: 'inline'
  end

  def badge_offense
    badge = LintCI::Badge.new('Offenses', @repository.offense_count,
                              @repository.badge_color,
                              params.except(:action))
    send_file badge.file, disposition: 'inline'
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
