class AuthorizationController < WebsocketRails::BaseController

  def authorize_channels
    # The channel name will be passed inside the message Hash
    puts message
    # channel = WebsocketRails[message[:channel]]
    # if channel.name.to_s.match(/\A[a-zA-Z_]+_\d+\Z/)
    #   array = channel.name.to_s.split('_')
    #   id = array[-1]
    #   channel = array[0...-1].join('_')
    #   model_class = channel_model(channel)
    #   unless model_class.nil?
    #     model = model_class.find_by_id(id)
    #     deny_channel(message: 'Object not found!') if model.nil?
    #     deny_channel(message: 'Authorization failed!') unless can? :subscribe, model
    #   end
    #   accept_channel current_user
    # else
    #   if can? :subscribe, channel
    #     accept_channel current_user
    #   else
    #     deny_channel(message: 'Authorization failed!')
    #   end
    # end
    accept_channel current_user
  end

  def channel_model(channel)
    {repository_processing: Repository}[channel.to_sym]
  end
end
