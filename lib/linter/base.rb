# Linter base class
class Linter::Base
  class << self
    attr_accessor :_language
    attr_accessor :_keys
  end


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
    linter_names = Set.new(linter_names.flatten).map(&:to_sym)
    linters = []
    subclasses.each do |cls|
      linters << cls if (cls._keys & linter_names).any?
    end
    linters
  end


  attr_accessor :directory
  attr_accessor :config

  # Track the number of offenses found while scanning
  attr_accessor :linter

  def initialize(revision, directory, config)
    @directory = directory
    @config = config
    @revision = revision
    @linter = Linter.new(name: self.class.name.demodulize.downcase, offense_count: 0)
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

  # Create a new offense USE this DO NOT do Offense.new directly
  def new_offense(message)
    offense = Offense.new
    offense.message = message
    @linter.offenses << offense
    @linter.offense_count += 1
    offense
  end

  def exec(command)
    Open3.popen3(command, chdir: @directory) do |_i, o, _e, _t|
      return o.read.chomp
    end
  end

  # ./node_modules Dir
  def node_modules
    Rails.root.join('node_modules')
  end

  # ./node_modules/.bin Dir

  def node_modules_bin
    node_modules.join('.bin')
  end
end

require_dependency 'linter/rubocop'
require_dependency 'linter/js_hint'
require_dependency 'linter/coffeelint'
