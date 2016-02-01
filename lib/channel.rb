# Helper method to select the right channel
# Call Channel.<channel_name> to get the channel object
# Call Channel.<channel_name>_path to get the channel path
module Channel
  class << self
    PATH_REGEX = /([A-Za-z_]+)_path/
    def config
      Channel::Config
    end

    def routes
      config.routes
    end

    def method_missing(method_sym, *args)
      if PATH_REGEX.match(method_sym)
        channel = routes.channels[Regexp.last_match[1].to_sym]
        return channel.path(*args) if channel.present?
      end
      websocket_channel(method_sym, *args)
    end

    # @param name Name of the channel
    # @params args List of arguments to generate channel path
    def websocket_channel(name, *args)
      return unless routes.channels.key?(name)
      channel = routes.channels[name]
      WebsocketRails[channel.path(*args)]
    end
  end
end
