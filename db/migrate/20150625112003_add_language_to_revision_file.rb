class AddLanguageToRevisionFile < ActiveRecord::Migration
  def change
    add_column :revision_files, :language, :string
  end
end
