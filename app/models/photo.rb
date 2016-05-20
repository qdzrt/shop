class Photo < ActiveRecord::Base
  belongs_to :product
  include ImageUploader[:avatar]
end