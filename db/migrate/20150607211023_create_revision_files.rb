class CreateRevisionFiles < ActiveRecord::Migration
  def change
    create_table :revision_files do |t|
      t.references :revision, index: true, foreign_key: true
      t.string :path
      t.integer :offense_count

      t.timestamps null: false
    end
  end
end
