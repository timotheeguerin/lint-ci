# Linter serializer
# @see Linter
class LinterSerializer < ApplicationSerializer
  attributes :id, :name, :offense_count, :status, :offense_ratio

end
