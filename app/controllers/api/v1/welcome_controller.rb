# Repositories user controller
class Api::V1::WelcomeController < Api::V1::BaseController
  before_action do
    authorize! :current, current_user
  end

  # GET /api/v1/
  # render a list of urls to be used
  def index
    render json: routes
  end

  def urls
    {
      current_user_url: api_current_user_url,
      users_url: api_users_url
    }
  end

  def routes
    out = {}
    Rails.application.routes.routes.named_routes.each do |name, route|
      next unless /\Aapi_(.*)/ =~ name
      name = Regexp.last_match[1]
      spec = route.path.spec.to_s
      spec.gsub!('(.:format)', '')
      spec.gsub!(/:(?<name>[a-zA-Z_]*)/, '{\k<name>}')
      out[name] = spec
    end
    out
  end
end
