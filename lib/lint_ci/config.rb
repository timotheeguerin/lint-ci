# User config
class LintCI::Config

  # Languages
  attr_accessor :languages

  def initialize(hash = {})
    @languages = hash.fetch(:languages, [:ruby])
  end

  def self.load_yml(filename)
    if File.file? filename
      new(YAML.load(File.read(filename)))
    else
      new
    end
  end
end
