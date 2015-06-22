class AddJobIdToRepository < ActiveRecord::Migration
  def change
    add_column :repositories, :job_id, :string
  end
end
