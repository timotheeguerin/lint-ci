class AuthorizationController < WebsocketRails::BaseController

  def authorize_channels
    channel = Channel.routes.find(message[:channel])
    return deny_channel(message: '404 Channel not found!') if channel.nil?
    instance_exec(*channel.extract_args(message[:channel]), &channel.callback)
    accept_channel current_user
  rescue Cancan::AccessDenied
    deny_channel(message: 'Unauthorized!')
  end
end
