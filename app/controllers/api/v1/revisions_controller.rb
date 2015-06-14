class Api::V1::RevisionsController < Api::V1::BaseController
  load_and_authorize_resource :repository
  load_and_authorize_resource through: :repository
end
