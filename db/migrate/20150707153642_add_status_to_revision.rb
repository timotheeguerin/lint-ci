class AddStatusToRevision < ActiveRecord::Migration
  def change
    add_column :revisions, :status, :integer, default: 0
  end
end
