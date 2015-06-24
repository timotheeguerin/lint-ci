# Repositories user controller
class Api::V1::UsersController < Api::V1::BaseController
  load_and_auth_user

  protected

  def init
    @users = User.empty
    @user = User.new
  end
end
