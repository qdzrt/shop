class CreatePhotos < ActiveRecord::Migration
  def change
    create_table :photos do |t|
      t.integer :product_id, index: true
      t.text :avatar_data

      t.timestamps null: false
    end
  end
end
