class CreateLinters < ActiveRecord::Migration
  def change
    create_table :linters do |t|
      t.string :name, null: false
      t.references :revision, index: true, foreign_key: true
      t.integer :offense_count, null: false

      t.timestamps null: false
    end

    add_column :offenses, :linter_id, :integer, default: 0
  end
end
