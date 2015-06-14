# Repository serializer
# @see Repository
class RevisionSerializer < ApplicationSerializer
  attributes :id, :sha, :message, :offense_count, :date

  has_many :files

  url [:repository, :revision]
end
