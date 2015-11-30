# Controller that handle the repository badges
class BadgesController < ApplicationController
  load_and_auth_repository parents: true

  def index
  end

  def quality
    badge = badge('Style', branch.badge_message)
    send_file badge.file, disposition: 'inline'
  end

  def offense
    badge = badge('Offenses', branch.offense_count)
    send_file badge.file, disposition: 'inline'
  end

  def badge_params
    params.permit(:label, :style)
  end

  protected def branch
    @branch ||= if params[:branch]
                  @repository.branches.find(params[:branch])
                else
                  @repository.default_branch
                end
  end

  protected def badge(label, value)
    color = branch.badge_color
    LintCI::Badge.new(label, value, color, badge_params)
  end
end
