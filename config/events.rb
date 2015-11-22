WebsocketRails::EventMap.describe do
  namespace :websocket_rails do
    subscribe :subscribe_private, to: AuthorizationController, with_method: :authorize_channels
  end
  subscribe :testeventsent, to: AuthorizationController, with_method: :test_event
end
