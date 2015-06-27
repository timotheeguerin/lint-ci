# Handle the highlighting of a file
class LintCI::Highlighter
  def self.formatter
    @formatter ||= Rouge::Formatters::HTML.new(css_class: 'highlight', line_numbers: false)
  end

  def initialize(file)
    @file = file
  end

  def language
    @file.language
  end

  def lexer_cls
    @lexer_cls ||= (Rouge::Lexer.find(language) || Rouge::Lexers::Ruby)
  end

  def lexer
    @lexer ||= lexer_cls.new
  end

  def highlight
    self.class.formatter.format(lexer.lex(@file.content))
  end
end
