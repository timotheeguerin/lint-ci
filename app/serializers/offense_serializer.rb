# Offense serializer
# @see Offense
class OffenseSerializer < ApplicationSerializer
  attributes :id, :severity, :message, :line, :column, :length


  url [:repository, :revision]
end
