# Revision file html controller
class RevisionFilesController < ApplicationController
  load_and_auth_revision_file parents: true

  def show
  end
end
