# Repository serializer
# @see Repository
class RevisionFileSerializer < ApplicationSerializer
  attributes :id, :path, :offense_count

  has_many :offenses

  url :repository
end
