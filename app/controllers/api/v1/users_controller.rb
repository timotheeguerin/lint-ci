# Repositories user controller
class Api::V1::UsersController < Api::V1::BaseController
  load_and_authorize_resource

  def index
    render json: @users
  end

  def show
    render json: @user
  end

  protected

  def init
    @users = User.empty
    @user = User.new
  end
end
