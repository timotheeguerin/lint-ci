# Revision file controller
class Api::V1::RevisionFilesController < Api::V1::BaseController
  load_and_authorize_resource :user
  load_and_authorize_resource :repository, through: :user, through_association: :repos
  load_and_authorize_resource :revision, through: :repository
  load_and_authorize_resource through: :revision, through_association: :files

  def content
    formatter = Rouge::Formatters::HTML.new(css_class: 'highlight', line_numbers: true)
    lexer = Rouge::Lexers::Ruby.new
    render json: {raw: formatter.format(lexer.lex(@revision_file.content))}
    # render json: {raw: @revision_file.content}
  end
end
