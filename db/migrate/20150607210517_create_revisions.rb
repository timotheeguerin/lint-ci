class CreateRevisions < ActiveRecord::Migration
  def change
    create_table :revisions do |t|
      t.references :repository, index: true, foreign_key: true
      t.string :sha
      t.integer :order
      t.string :message
      t.datetime :date

      t.timestamps null: false
    end
  end
end
