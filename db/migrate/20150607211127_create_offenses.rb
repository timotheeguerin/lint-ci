class CreateOffenses < ActiveRecord::Migration
  def change
    create_table :offenses do |t|
      t.references :file, index: true
      t.string :message
      t.integer :line
      t.integer :column
      t.integer :length
      t.integer :severity

      t.timestamps null: false
    end
  end
end
