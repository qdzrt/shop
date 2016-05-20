class CreateAttachments < ActiveRecord::Migration
  def change
    create_table :attachments do |t|
      t.integer :cashadv_id
      t.has_attached_file :image
      t.has_attached_file :document
      t.has_attached_file :audio

      t.timestamps null: false
    end
  end
end
