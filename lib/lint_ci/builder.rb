# Clone the repo and scan for errors
class LintCI::Builder
  # @param repository [Repository]
  def initialize(repository)
    @repository = repository
    @dir = Dir.mktmpdir(@repository.name)
  end

  def run
    clone_repository
    config = load_config
    linters = Linter::Base.linters(config.languages)
    revision = new_revision
    linters.each do |cls|
      linter = cls.new(revision, repository_path, config)
      linter.review
      revision.save
    end
  end

  def new_revision
    revision = Revision.new
    revision.sha = nil
    revision.repository = @repository
    revision
  end

  def load_config
    config_path = File.join(repository_path, '.lint-ci.yml')
    LintCi::Config.load_yml(config_path)
  end

  def cleanup
    FileUtils.remove_entry_secure @dir
  end

  protected def clone_repository
    Git.clone(@repository.github_url, @repository.name, path: repo.user.local_path)
  end

  protected def repository_path
    File.join(@dir, @repository.name)
  end
end
