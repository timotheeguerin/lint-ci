# Api V1 Base
module Api::V1
  # Base controller
  class BaseController < Api::BaseController
    helper_method :get_resource, :get_resources, :resource_name, :resources_name

    # GET /api/v1/{plural_resource_name}
    def index
      resource = get_resources
      if params.key? :order_by
        sens = params[:order_sens] || 'ASC'
        resource = resource.order(params[:order_by] => sens)
      end
      resource = resource.page(params[:page]).per(params[:per_page])
      resource = resource.where(query_params)
      set_resources resource
      render json: get_resources
    end

    # GET /api/v1/{plural_resource_name}/:id
    def show
      render json: get_resource
    end

    # POST /api/v1/{plural_resource_name}
    def create
      if get_resource.save
        render :show, status: :created
      else
        render json: get_resource.errors, status: :unprocessable_entity
      end
    end


    # PATCH/PUT /api/v1/{plural_resource_name}/:id
    def update
      if get_resource.save
        render :show
      else
        render json: get_resource.errors, status: :unprocessable_entity
      end
    end

    # DELETE /api/v1/{plural_resource_name}/:id
    def destroy
      get_resource.destroy
      head :no_content
    end

    protected

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

    # Returns the allowed parameters for searching
    # Override this method in each API controller
    # to permit additional parameters to search on
    # @return [Hash]
    def query_params
      {}
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

    # Only allow a trusted parameter "white list" through.
    # If a single resource is loaded for #create or #update,
    # then the controller for the resource must implement
    # the method "#{resource_name}_params" to limit permitted
    # parameters for the individual model.
    def resource_params
      @resource_params ||= self.send("#{resource_name}_params")
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_resource(resource = nil)
      resource ||= resource_class.find(params[:id])
      instance_variable_set("@#{resource_name}", resource)
    end

    # Set the resources for the controller
    # @return [Object]
    def set_resources(resources)
      instance_variable_set("@#{resource_name.pluralize}", resources)
    end
  end
end
