# Top Lint-ci controller
class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  helper_method :get_resource, :get_resources, :resource_name, :resources_name
  
  alias_method :devise_user, :current_user
  helper_method :current_user

  def current_user
    devise_user
  end

  # Returns the resource from the created instance variable
  # @return [Object]
  def get_resource
    instance_variable_get("@#{resource_name}")
  end

  # Returns the resources from the created instance variable
  # @return [Object]
  def get_resources
    instance_variable_get("@#{resources_name}")
  end

  # Returns the allowed parameters for pagination
  # @return [Hash]
  def page_params
    params.permit(:page, :per_page)
  end

  # The resource class based on the controller
  # @return [Class]
  def resource_class
    @resource_class ||= resource_name.classify.constantize
  end

  # The singular name for the resource class based on the controller
  # @return [String]
  def resource_name
    @resource_name ||= self.controller_name.singularize
  end

  # The plural name for the resource class based on the controller
  # @return [String]
  def resources_name
    @resources_name ||= self.controller_name.pluralize
  end
end
