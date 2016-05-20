class CreateProvinces < ActiveRecord::Migration
  def change
    create_table :provinces do |t|
      t.string :cityId
      t.string :cityName

      t.timestamps null: false
    end
  end
end
