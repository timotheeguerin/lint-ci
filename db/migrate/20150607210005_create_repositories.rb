class CreateRepositories < ActiveRecord::Migration
  def change
    create_table :repositories do |t|
      t.string :name
      t.string :url
      t.boolean :enabled, default: false
      t.datetime :last_sync_at

      t.timestamps null: false
    end
  end
end
