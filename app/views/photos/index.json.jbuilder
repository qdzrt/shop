json.array!(@photos) do |photo|
  json.extract! photo, :id, :product_id, :avatar_data
  json.url photo_url(photo, format: :json)
end
