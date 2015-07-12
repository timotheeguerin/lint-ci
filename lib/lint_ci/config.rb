# User config
class LintCI::Config

  # Languages
  attr_accessor :linters

  def initialize(hash = {})
    @linters = hash.fetch(:linters, [])
  end

  def self.load_yml(filename)
    if File.file? filename
      new(YAML.load(File.read(filename)).symbolize_keys)
    else
      new
    end
  end
end
