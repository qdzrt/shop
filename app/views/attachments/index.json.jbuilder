json.array!(@attachments) do |attachment|
  json.extract! attachment, :id, :cashadv_id, :image, :document, :audio
  json.url attachment_url(attachment, format: :json)
end
