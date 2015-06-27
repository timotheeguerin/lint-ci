# User config
class LintCI::Config

  # Languages
  attr_accessor :linters

  def initialize(hash = {})
    @linters = hash.fetch(:linters, [:javascript])
  end

  def self.load_yml(filename)
    if File.file? filename
      new(YAML.load(File.read(filename)))
    else
      new
    end
  end
end
