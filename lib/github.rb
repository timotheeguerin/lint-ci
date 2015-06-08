class Github
  def self.octokit
    @octokit ||= Octokit::Client.new(client_id: ENV['github_client_id'],
                                     client_secret: ENV['github_client_secret'])
  end
end
