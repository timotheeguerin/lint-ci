# Repository serializer
# @see Repository
class ApplicationSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  # 0.8.3
  # self.root = false
end
