# Revision file controller
class Api::V1::RevisionFilesController < Api::V1::BaseController
  load_and_auth_revision_file parents: true

  def content
    value = LintCI::Highlighter.new(@revision_file).highlight
    render json: {highlighted: value}
  end
end
