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
    current_user.access_token
  end

  def github
    current_user.github
  end

  def after_sign_in_path_for(user)
    if user.memberships.empty?
      user_repo_settings_path
    else
      root_path
    end
  end
end
