module Channel
  # Channel config
  module Config
    class << self
      def routes
        @routes ||= Channel::Routing.new
      end
    end
  end
end

load "#{Rails.root}/config/channels.rb" if File.exist?("#{Rails.root}/config/channels.rb")
