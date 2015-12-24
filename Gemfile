source 'https://rubygems.org'
ruby '2.2.4'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.2.2'
# Use postgres as the database for Active Record
gem 'pg'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 4.1.0'

# Use jquery as the JavaScript library
gem 'jquery-rails'
# Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks
gem 'turbolinks'
# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0', group: :doc

gem 'active_model_serializers',
    git: 'https://github.com/rails-api/active_model_serializers.git', tag: 'v0.10.0.rc1'
# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

gem 'sprockets'
gem 'sprockets-es6'
# gem 'websocket-rails', github: 'timcolonel/websocket-rails'
# gem 'websocket-rails', path: '../websocket-rails'
# gem 'websocket-rails', github: 'moaa/websocket-rails', branch: 'sync_fixes'
gem 'websocket-rails', github: 'moaa/websocket-rails', branch: 'threadsocket-rails'
gem 'websocket-rails-js', github: 'websocket-rails/websocket-rails-js', branch: 'sub_protocols'

gem 'figaro'

gem 'hiredis'
gem 'redis', require: %w(redis redis/connection/hiredis)

# Authentication
gem 'devise'
gem 'cancancan'
gem 'omniauth-github'

gem 'quiet_assets'
gem 'sidekiq'

# Paging
gem 'kaminari'
gem 'api-pagination'

# Git api
gem 'octokit'
gem 'git'

gem 'friendly_id'
# For ruby lint
gem 'rubocop'


gem 'rouge'

gem 'react-rails', '~> 1.4.0'
gem 'font-awesome-rails'
gem 'bower-rails', '~> 0.10.0'
gem 'neat'
gem 'benchmark-ips'
gem 'autoprefixer-rails'

# For Sidekiq monitor
gem 'sinatra', require: nil

group :development, :test do
  gem 'thin'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'rspec-rails', '~> 3.0'
  gem 'factory_girl_rails'
  gem 'capistrano', require: false
  gem 'capistrano-rbenv', require: false
  gem 'capistrano-bundler', require: false
  gem 'capistrano-rails', require: false
  gem 'capistrano3-puma', require: false
  gem 'capistrano-sidekiq', require: false
  gem 'capistrano-rails-console', require: false
end

group :test do
  gem 'faker'
  gem 'webmock'
end

group :production do
  gem 'puma', '>= 2.15.3'
end
