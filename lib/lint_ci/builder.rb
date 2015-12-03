# Clone the repo and scan for errors
class LintCI::Builder
  # @param revision [Revision]
  def initialize(revision)
    @revision = revision
    @branch = revision.branch
    @repository = @branch.repository
    checkout
    notify('Repository cloned!')
    cleanup_existing
    init_revision
  end

  def run
    config = load_config
    linters = Linter::Base.fetch_linters_for(config.linters)
    notify('Running linters...')

    linters.each do |cls|
      notify("Running #{cls}...")

      linter = cls.new(@revision, dir, config)
      linter.review
      @revision.linters << linter.linter
      @revision.offense_count += linter.linter.offense_count
    end
    notify('Scanning complete!')
    @revision.save!
  end

  def cleanup_existing
    revision = Revision.find_by_sha(commit.sha)
    revision.destroy if revision.present? && @revision.id != revision.id
  end

  def init_revision
    @revision.sha = commit.sha
    @revision.message = commit.message
    @revision.date = commit.date
    @revision.offense_count = 0
    @revision
  end

  def load_config
    config_path = File.join(dir, '.lint-ci.yml')
    LintCI::Config.load_yml(config_path)
  end

  def cleanup
    FileUtils.remove_entry_secure dir
  end

  def commit
    @commit ||= @git.object('HEAD')
  end

  def root_dir
    @root_dir ||= File.join(LintCI.build_dir, SecureRandom.hex, @repository.owner.username)
  end

  def dir
    File.join(root_dir, @repository.name)
  end

  def clone
    notify('Cloning repository...')
    FileUtils.mkdir_p(root_dir)
    @git ||= Git.clone(@repository.github_url, @repository.name, branch: @branch.name, path: root_dir)
  end

  def checkout
    clone
    notify('Updating to commit...')
    @git.checkout(@revision.sha)
  end

  def channel
    Channel.repo_revision_scan_update(@branch.repository, @branch, @revision)
  end

  def notify(message)
    channel.trigger('update', message)
  end
end
