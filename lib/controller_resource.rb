# Helper class methods that can be called in the controller
module ControllerResource
  extend ActiveSupport::Concern

  # :nodoc:
  module ClassMethods
    def load_and_auth_user(**kwargs)
      load_and_authorize_resource :user, id_param: :user, **kwargs
    end

    def load_and_auth_repository(**kwargs)
      load_and_auth_user(**kwargs) if kwargs[:parents]
      load_and_authorize_resource :repository,
                                  id_param: :repo,
                                  through: :user, through_association: :repos, **kwargs
    end

    def load_and_auth_revision(**kwargs)
      load_and_auth_repository(**kwargs) if kwargs[:parents]
      load_and_authorize_resource :revision,
                                  id_param: :revision,
                                  through: :repository, through_association: :revisions, **kwargs
    end

    def load_and_auth_revision_file(**kwargs)
      load_and_auth_revision(**kwargs) if kwargs[:parents]
      load_and_authorize_resource :revision_file,
                                  id_param: :file,
                                  through: :revision, through_association: :files, **kwargs
    end

    def load_and_auth_offense(**kwargs)
      load_and_auth_revision_file(**kwargs) if kwargs[:parents]
      load_and_authorize_resource :offense,
                                  id_param: :file,
                                  through: :revision_file, through_association: :offenses, **kwargs
    end
  end
end
