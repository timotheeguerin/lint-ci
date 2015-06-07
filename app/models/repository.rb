# Class containing repository
class Repository < ActiveRecord::Base
  has_many :memberships, dependent: :destroy
  has_many :users, through: :memberships

  has_many :revisions
end
