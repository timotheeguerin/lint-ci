# Linter base class
class Linter::Base

  attr_accessor :directory
  attr_accessor :config

  def initialize(revision, directory, config)
    @directory = directory
    @config = config
    @revision = revision
  end

  def review
    fail NotImplementedError
  end

  # Get the list of linters
  def self.linters(*languages)
    {ruby: Linter::Rubocop,
     rubocop: Linter::Rubocop
    }.slice(*languages.flatten)
  end

  def exec(command, *args)
    args = args.map { |x| %("#{x}") }.join(' ')
    `#{command} #{args}`
  end
end
