# Revision controller
class RevisionsController < ApplicationController
  load_and_auth_revision parents: true

  def show
  end
end
