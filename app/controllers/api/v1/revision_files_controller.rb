# Revision file controller
class Api::V1::RevisionFilesController < Api::V1::BaseController
  load_and_authorize_resource :repository
  load_and_authorize_resource :revision, through: :repository
  load_and_authorize_resource through: :revision, through_association: :files
end
