# Application helper.
module ApplicationHelper
  def json_for(target, options = {})
    options[:scope] ||= self
    options[:url_options] ||= url_options
    serializer = ActiveModel::Serializer.serializer_for(target)
      # .to_json
    return serializer.new(target, options)
  end
end
