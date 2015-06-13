# Linter base class
class Linter::Base

  attr_accessor :directory
  attr_accessor :config

  def initialize(directory, config)
    @directory = directory
    @config = config
  end

  def review
    fail NotImplementedError
  end

  def linters
    {ruby: Linter::Rubocop}
  end
end
