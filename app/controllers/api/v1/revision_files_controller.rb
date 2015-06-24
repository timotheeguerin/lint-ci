# Revision file controller
class Api::V1::RevisionFilesController < Api::V1::BaseController
  load_and_auth_revision_file parents: true

  def content
    formatter = Rouge::Formatters::HTML.new(css_class: 'highlight', line_numbers: false)
    lexer = Rouge::Lexers::Ruby.new
    render json: {raw: formatter.format(lexer.lex(@revision_file.content))}
    # render json: {raw: @revision_file.content}
  end
end
