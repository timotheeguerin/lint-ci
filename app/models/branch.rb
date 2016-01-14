# Repository branch
class Branch < ActiveRecord::Base
  extend FriendlyId
  friendly_id :name, use: [:finders]

  belongs_to :repository

  validates :name, uniqueness: {scope: [:repository_id]}

  has_many :revisions, dependent: :destroy
  has_one :current_revision, class_name: 'Revision'

  def style_status
    revision = current_revision
    revision ? revision.style_status : :unavailable
  end

  # Get the current number of offense in the latest revision of the default branch
  # If the branch has never been scanned it will return unavailable.
  def offense_count
    revision = current_revision
    revision ? revision.offense_count : :unavailable
  end

  def badge_message
    style_status.to_s.capitalize
  end

  def badge_color
    badge_colors[style_status]
  end

  def badge_colors
    {perfect: 'brightgreen',
     great: 'green',
     good: 'yellowgreen',
     acceptable: 'yellowgreen',
     warning: 'yellow',
     dirty: 'orange',
     bad: 'red',
     unavailable: 'lightgray'}
  end
end
