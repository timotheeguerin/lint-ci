# Lint CI
module LintCI
  def self.repositories_root
    unless ENV.key? 'repositories_root'
      fail ConfigError('No repositories root defined! Define it in application.yml or as env var')
    end
    @repositories_root ||= ENV['repositories_root'].sub(/\A~/, Dir.home)
  end
end
