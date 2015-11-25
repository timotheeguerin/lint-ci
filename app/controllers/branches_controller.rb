# Repo controller
class BranchesController < ApplicationController
  load_and_auth_branch parents: true

  def show
  end

  private

  def query_params
    params.permit(:name)
  end

  def init
    @branch = Branch.new
    @branches = Branch.empty
  end
end
