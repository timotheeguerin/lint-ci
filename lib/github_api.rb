# Github api class
class GithubApi
  cattr_writer :enable_hook

  def self.enable_hook?
    @enable_hook ||= true
  end

  def self.octokit
    @octokit ||= Octokit::Client.new(client_id: ENV['github_client_id'],
                                     client_secret: ENV['github_client_secret'])
  end

  # Add a new hook
  # @param repository [Repository] Repository to watch.
  # @param callback_url [String] Hook callback url
  def self.create_hook(repository, callback_url)
    return unless enable_hook?
    hook = octokit.create_hook(repository.full_name, 'web',
                               {url: callback_url, content_type: 'json'},
                               events: ['push'], active: true)
    yield hook if block_given?
    hook
  rescue Octokit::UnprocessableEntity => e
    if e.message.include? 'Hook already exists!'
      true
    else
      raise
    end
  end

  # Remove a hook
  # @param repository [Repository] Repository to stop watching.
  def self.remove_hook(repository)
    return unless enable_hook?
    response = octokit.remove_hook(repository.full_name, repository.hook_id)

    yield if block_given?
    response
  end
end
