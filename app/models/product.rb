class Product < ActiveRecord::Base
  has_many :photos
  has_many :attachments
  accepts_nested_attributes_for :attachments, allow_destroy: true
end
