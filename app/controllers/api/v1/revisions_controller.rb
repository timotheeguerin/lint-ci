# Api Revision controller
class Api::V1::RevisionsController < Api::V1::BaseController
  load_and_auth_revision parents: true
end
