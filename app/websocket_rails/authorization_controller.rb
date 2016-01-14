# Controller for websocket channels It will authenticate the request and retrieve the right channel
class AuthorizationController < WebsocketRails::BaseController
  def authorize_channels
    channel = Channel.routes.find(message[:channel])
    return deny_channel(message: '404 Channel not found!') if channel.nil?
    instance_exec(*channel.extract_args(message[:channel]), &channel.callback)
    accept_channel current_user
  rescue Cancan::AccessDenied
    deny_channel(message: 'Unauthorized!')
  end

  def test_event
    puts "Received event with data: #{message}"
    broadcast_message :testevent, 'THis test is working...'
  end
end
