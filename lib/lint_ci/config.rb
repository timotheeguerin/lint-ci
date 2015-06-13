# User config
class LintCI::Config

  # Languages
  attr_accessor :languages

  def initialize(hash)
    @languages = hash.fetch(:languages, [])
  end

  def self.load_yml(filename)
    new(YAML.load(File.read(filename)))
  end
end
