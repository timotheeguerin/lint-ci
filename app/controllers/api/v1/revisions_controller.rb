class Api::V1::RevisionsController < Api::V1::BaseController
  load_and_authorize_resource :user
  load_and_authorize_resource :repository, through: :user, through_association: :repos
  load_and_authorize_resource through: :repository
end
