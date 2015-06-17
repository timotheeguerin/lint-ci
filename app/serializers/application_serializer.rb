# Repository serializer
# @see Repository
class ApplicationSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  def url_options
    @options[:url_options] || {}
  end

  class << self
    attr_accessor :links

    def link(name, &block)
      attribute name
      define_method name, &block
    end
  end
end
