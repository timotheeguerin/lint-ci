class CreateRevisions < ActiveRecord::Migration
  def change
    create_table :revisions do |t|
      t.references :repository, index: true, foreign_key: true
      t.string :sha
      t.string :message
      t.string :offense_count, default: 0
      t.datetime :date

      t.timestamps null: false
    end
  end
end
