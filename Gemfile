source 'https://rubygems.org'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.2.1'
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

gem 'figaro'
gem 'devise'
gem 'cancancan'
gem 'omniauth-github'
gem 'quiet_assets'
gem 'sidekiq'
gem 'kaminari'
gem 'octokit'
gem 'git'

# For ruby lint
gem 'rubocop'

gem 'react-rails'

group :development, :test do
  gem 'thin'

  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug'

  # Access an IRB console on exception pages or by using <%= console %> in views
  gem 'web-console', '~> 2.0'

  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'

  gem 'rspec-rails', '~> 3.0'
  gem 'factory_girl_rails'
end

group :production do
  gem 'puma'
end
