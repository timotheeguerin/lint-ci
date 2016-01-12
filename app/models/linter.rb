# Revision linter
class Linter < ActiveRecord::Base
  belongs_to :revision

  has_many :offenses


  default_scope do
    order(offense_count: :desc)
  end

  def status
    case offense_count
    when 0
      :perfect
    when 1..10
      :warning
    when 11..20
      :dirty
    else
      :bad
    end
  end

  def offense_ratio
    return 0 if revision.offense_count == 0
    offense_count / revision.offense_count
  end
end
