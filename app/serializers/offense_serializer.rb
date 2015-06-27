# Offense serializer
# @see Offense
class OffenseSerializer < ApplicationSerializer
  attributes :id, :severity, :message, :line, :column, :length

  belongs_to :linter
  url [:repository, :revision]
end
