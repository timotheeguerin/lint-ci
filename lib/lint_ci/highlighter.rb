# Handle the highlighting of a file
class LintCI::Highlighter
  def self.formatter
    @formatter ||= Rouge::Formatters::HTML.new(css_class: 'highlight', line_numbers: false)
  end

  def self.lexer_for(name)

  end

  def initialize(file)
    @file = file
  end

  def language
    @file.language
  end

  def lexer
    @lexer ||= Rouge::Lexers.find(language).new
  end

  def highlight
    self.class.formatter.format(lexer.lex(file.content))
  end
end
