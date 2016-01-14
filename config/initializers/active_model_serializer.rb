# Don't include the root when rendering json
# ActiveModel::Serializer.root = false
# ActiveModel::ArraySerializer.root = false

# Add back

module ActionController
  # Serialization
  module Serialization
    [:_render_option_json, :_render_with_renderer_json].each do |renderer_method|
      define_method renderer_method do |resource, options|
        @_adapter_opts, @_serializer_opts =
          options.partition { |k, _| ADAPTER_OPTION_KEYS.include? k }.map { |h| Hash[h] }

        if use_adapter? && (serializer = get_serializer(resource))
          if self.respond_to?(:default_serializer_options)
            @_serializer_opts.reverse_merge!(default_serializer_options)
          end
          @_serializer_opts[:url_options] = url_options

          @_serializer_opts[:scope] ||= serialization_scope
          @_serializer_opts[:scope_name] = _serialization_scope

          # omg hax
          object = serializer.new(resource, @_serializer_opts)
          adapter = ActiveModel::Serializer::Adapter.create(object, @_adapter_opts)
          super(adapter, options)
        else
          super(resource, options)
        end
      end
    end
  end
end
# ActiveModel::Serializer.config.adapter = ActiveModel::Serializer::Adapter::JsonApi
