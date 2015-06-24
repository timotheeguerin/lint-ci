# Top Lint-ci controller
class ApplicationController < ActionController::Base
  include ControllerResource

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  alias_method :devise_user, :current_user

  def json_request?
    request.format.json?
  end

  def github_token
    session['devise.github_data']['credentials']['token']
  end

  def github
    @github ||= GithubApi.new(github_token)
  end
end
