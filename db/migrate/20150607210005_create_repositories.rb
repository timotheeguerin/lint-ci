class CreateRepositories < ActiveRecord::Migration
  def change
    create_table :repositories do |t|
      t.string :name
      t.string :owner
      t.string :full_name
      t.string :github_url
      t.string :hook_id
      t.boolean :enabled, default: false
      t.datetime :last_sync_at

      t.timestamps null: false
    end
  end
end
