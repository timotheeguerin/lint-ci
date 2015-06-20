# Revision controller
class RevisionsController < ApplicationController
  resource [:user, :repository, :revision]

  def show

  end
end
