# A membership correspond to a user being a collaborator on a project
class Membership < ActiveRecord::Base
  belongs_to :repository
  belongs_to :user
end
