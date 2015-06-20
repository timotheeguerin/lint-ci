# Application helper.
module ApplicationHelper
  def resource_root(resource)
    if resource.respond_to?(:first)
      fail "Resource can't be empty #{resource}" if resource.empty?
      resource.first.class.table_name
    else
      resource.class.table_name
    end
  end

  def serialization_adapter_for(resource)
    serializer = ActiveModel::Serializer.serializer_for(resource)
    # SERIALIZER_OPTS = :serializer, :each_serializer, etc
    serializer_opts = {each_serializer: serializer}
    serializer_opts[:url_options] ||= url_options
    object = serializer.new(resource, serializer_opts)
    # ADAPTER_OPTION_KEYS = [:include, :fields, :root, :adapter]
    adapter_opts = {root: resource_root(resource)}

    ActiveModel::Serializer::Adapter.create(object, adapter_opts)
  end

  def json_for(target, options = {})
    options[:scope] ||= current_user
    adapter = serialization_adapter_for(target)
    adapter.as_json
  end
end
