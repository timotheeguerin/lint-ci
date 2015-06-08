# Default template for the show of a resource: Render the _show partial
json.partial! 'show', resource_name.to_sym => get_resource
