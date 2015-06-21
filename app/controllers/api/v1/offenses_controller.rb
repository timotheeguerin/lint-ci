# Revision file controller
class Api::V1::OffensesController < Api::V1::BaseController
  load_and_authorize_resource :user
  load_and_authorize_resource :repository, through: :user, through_association: :repos
  load_and_authorize_resource :revision, through: :repository
  load_and_authorize_resource :revision_file, through: :revision, through_association: :files
  load_and_authorize_resource :offense, through: :revision_file, through_association: :offenses
end
