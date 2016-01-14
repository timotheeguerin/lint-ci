# rubocop:disable Style/GlobalVars
$redis = Redis.new(host: 'localhost', port: 6379, driver: :hiredis)
