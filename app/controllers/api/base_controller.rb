module Api
  class BaseController < ApplicationController
    respond_to :json, :xml

    rescue_from CanCan::AccessDenied do |e|
      render json: {message: 'Not authorized!'}, status: :forbidden
    end

  end
end
