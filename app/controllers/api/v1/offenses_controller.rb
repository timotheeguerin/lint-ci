# Revision file controller
class Api::V1::OffensesController < Api::V1::BaseController
  load_and_auth_offense parents: true
end
