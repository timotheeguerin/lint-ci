# Helper method to select the right channel
# Call Channel.<channel_name> to get the channel object
# Call Channel.<channel_name>_path to get the channel path
module Channel
  class << self
    def config
      Channel::Config
    end

    def routes
      config.routes
    end

    def method_missing(method_sym, *args)
      if /([A-Za-z_]+)_path/.match(method_sym)
        channel = routes.channels[Regexp.last_match[1].to_sym]
        return channel.path(*args) if channel.present?
      end
      return unless routes.channels.key? method_sym
      channel = routes.channels[method_sym]
      WebsocketRails[channel.path(*args)]
    end
  end
end
