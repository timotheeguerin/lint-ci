class Api::V1::RevisionsController < Api::V1::BaseController
  load_resource :user
  load_resource :repository, through: :user, through_association: :repos
  load_and_authorize_resource through: :repository
end
