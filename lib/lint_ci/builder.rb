# Clone the repo and scan for errors
class LintCI::Builder
  # @param repository [Repository]
  def initialize(repository)
    @repository = repository
    @git = @repository.git
    @dir = @repository.local_path
  end

  def run
    @git.pull
    Dir.chdir @dir do
      run_in_repo_dir
    end
  end

  def run_in_repo_dir
    config = load_config
    linters = Linter::Base.fetch_linters_for(config.linters)
    cleanup_existing
    revision = new_revision
    linters.each do |cls|
      linter = cls.new(revision, @dir, config)
      linter.review
    end
    revision.save!
  end

  def cleanup_existing
    revision = Revision.find_by_sha(commit.sha)
    revision.destroy unless revision.nil?
  end

  def new_revision
    revision = Revision.new
    revision.sha = commit.sha
    revision.repository = @repository
    revision.message = commit.message
    revision.date = commit.date
    revision
  end

  def load_config
    config_path = File.join(@dir, '.lint-ci.yml')
    LintCI::Config.load_yml(config_path)
  end

  def cleanup
    FileUtils.remove_entry_secure @dir
  end

  def commit
    @commit ||= @git.object('HEAD^')
  end
end
