module Channel
  # Routing for channel
  class Routing
    attr_accessor :channels

    def initialize
      @channels = {}
    end

    def draw(&block)
      instance_eval(&block)
    end

    def channel(name, route, &block)
      @channels[name] = Route.new(route, block)
    end

    def find(channel)
      @channels.each do |_, route|
        return route if route.match(channel)
      end
      nil
    end
  end

  # Route container class
  class Route
    ARG_PATTERN = /:(?<name>[a-zA-Z_]*)/
    attr_accessor :callback
    attr_accessor :regex

    def initialize(pattern, callback)
      @pattern = pattern
      @callback = callback
      @regex = compute_regex(pattern)
    end

    def compute_regex(pattern)
      Regexp.new(pattern.gsub(ARG_PATTERN, '([^/]*)'))
    end

    def match(route)
      @regex.match(route)
    end

    def extract_args(route)
      @regex.match(route).to_a[1..-1]
    end

    def path(*args)
      current = @pattern.clone
      args.each do |arg|
        arg = arg.id if arg.is_a? ActiveRecord::Base
        current.sub!(ARG_PATTERN, arg.to_s)
      end
      current
    end
  end
end
