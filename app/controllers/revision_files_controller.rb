# Revision file html controller
class RevisionFilesController < ApplicationController
  load_and_authorize_resource :user
  load_and_authorize_resource :repository, through: :user, through_association: :repos
  load_and_authorize_resource :revision, through: :repository
  load_and_authorize_resource through: :revision, through_association: :files

  def show
  end
end
