# config valid only for current version of Capistrano
lock '3.4.0'

set :application, 'lint-ci'
set :repo_url, 'https://github.com/timcolonel/lint-ci'

set :rbenv_type, :system
set :rbenv_custom_path, '/opt/rbenv'
set :rbenv_ruby, File.read('.ruby-version').strip

set :linked_dirs, %w(tmp/pids tmp/sockets log)

namespace :deploy do

  desc 'Makes sure local git is in sync with remote.'
  task :check_revision do
    unless `git rev-parse HEAD` == `git rev-parse origin/master`
      puts 'WARNING: HEAD is not the same as origin/master'
      puts 'Run `git push` to sync changes.'
      exit
    end
  end

  before :deploy, 'deploy:check_revision'
  after :deploy, 'deploy:restart'
  after :rollback, 'deploy:restart'

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      # Your restart mechanism here, for example:
      # execute :touch, release_path.join('tmp/restart.txt')
    end
  end


  after :restart, :clear_cache do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
      # Here we can do anything such as:
      # within release_path do
      #   execute :rake, 'cache:clear'
      # end
    end
  end
end

namespace :task do

  # Run a rake task
  # $ cap staging rake:invoke task=<rake_task>
  # e.g.
  # $ cap staging rake:invoke task=rake db:migrate
  task :invoke do
    on roles(:app) do
      within "#{deploy_to}/current" do
        with rails_env: fetch(:rails_env, 'production') do
          rake ENV['task']
        end
      end
    end
  end
end

namespace :logs do
  desc 'tail rails logs'
  task :tail_rails do
    on roles(:app) do
      execute "tail -f #{shared_path}/log/#{fetch(:rails_env)}.log"
    end
  end
end
