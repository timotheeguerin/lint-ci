# Lint CI
module LintCI
  def self.data_path
    unless ENV.key? 'data_path'
      fail ConfigError('No repositories root defined! Define it in application.yml or as env var')
    end
    @data_path ||= ENV['data_path'].sub(/\A~/, Dir.home)
  end

  def self.repositories_path
    File.join(data_path, 'repositories')
  end

  def self.badge_path
    File.join(data_path, 'badges')
  end
end
