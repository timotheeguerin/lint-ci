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
  def linters(*languages)
    {ruby: Linter::Rubocop}.slice(*languages)
  end

  def exec(command, *args)
    args = args.map { |x| %("#{x}") }.join(' ')
    `#{command} #{args}`
  end
end
