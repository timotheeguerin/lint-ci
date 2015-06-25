# Linter base class
class Linter::Base

  attr_accessor :directory
  attr_accessor :config

  cattr_accessor :_language
  cattr_accessor :_keys
  # Set the linter language
  # Any file created in the linter will be mapped to this language
  def self.language(language)
    @_language = language
  end

  # Set the key with which the linter can be trigger
  # e.g. Rubocop: [:rubocop, :ruby]
  def self.keys(*keys)
    @_keys = Set.new(keys.flatten)
  end

  # Get the list of linters
  def self.fetch_linters_for(*linter_names)
    linters = []
    subclasses.each do |cls|
      if (cls._keys & linter_names).any?
        linters << cls
      end
    end
    linters
  end


  def initialize(revision, directory, config)
    @directory = directory
    @config = config
    @revision = revision
  end

  def review
    Benchmark.bm do |b|
      data = nil
      b.report 'Run linter' do
        data = run_linter
      end

      b.report 'Upload data' do
        upload(data)
      end
    end
  end

  # This method should handle calling the linter(Command line) and return the output
  def run_linter
    fail NotImplementedError
  end

  # Upload takes the output of #run_linter and upload to the database
  def upload(_data)
    fail NotImplementedError
  end

  # Create a new file
  # @param path [String] file path
  # @param language [Symbol]
  def new_file(path, language: nil)
    RevisionFile.new(path: path, language: language || self.class._language)
  end

  def exec(command, *args)
    args = args.map { |x| %("#{x}") }.join(' ')
    `#{command} #{args}`
  end
end
