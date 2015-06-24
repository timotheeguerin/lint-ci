module Api
  # All api version base controller
  class BaseController < ApplicationController
    respond_to :json, :xml
    skip_before_filter :verify_authenticity_token

    rescue_from CanCan::AccessDenied do |e|
      render json: {message: 'Not authorized!'}, status: :forbidden
    end

  end
end
