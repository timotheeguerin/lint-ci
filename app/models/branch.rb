class Branch < ActiveRecord::Base
  extend FriendlyId
  friendly_id :name, use: [:finders]

  belongs_to :repository

  validates :name, uniqueness: {scope: [:repository_id]}

  has_many :revisions, dependent: :destroy
  has_one :current_revision, class_name: 'Revision'
end
