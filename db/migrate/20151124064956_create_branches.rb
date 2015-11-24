class CreateBranches < ActiveRecord::Migration
  def change
    create_table :branches do |t|
      t.string :name
      t.references :repository, index: true, foreign_key: true

      t.timestamps null: false
    end

    add_reference :revisions, :branch, index: true
    add_foreign_key :revisions, :branches
  end
end
