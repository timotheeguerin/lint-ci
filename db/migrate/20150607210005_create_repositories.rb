class CreateRepositories < ActiveRecord::Migration
  def change
    create_table :repositories do |t|
      t.string :name
      t.string :full_name
      t.string :github_url
      t.string :hook_id
      t.references :owner, index: true
      t.boolean :enabled, default: false
      t.datetime :last_sync_at

      t.timestamps null: false
    end
    add_foreign_key :repositories, :users, column: :owner_id, primary_key: 'id'

  end
end
