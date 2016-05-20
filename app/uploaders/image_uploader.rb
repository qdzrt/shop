require 'image_processing/mini_magick'

class ImageUploader < Shrine
  include ImageProcessing::MiniMagick
  plugin :determine_mime_type
  plugin :store_dimensions
  plugin :validation_helpers
  plugin :versions, names: [:original, :medium, :small]
  plugin :pretty_location


  Attacher.validate do
    validate_max_size 5.megabytes, message: 'is too large (max is 5 MB)'
  end

  def process(io, context)
    if context[:phase] == :store
      suffix = io.data['id'].split('.').last
      if suffix =~ /jpeg|jpg|gif|png|bmp/i
        original = io.download
        size_500 = resize_to_limit(original,    500, 500)
        size_300 = resize_to_limit(size_500,    300, 300)
        {original: io, medium: size_500, small: size_300}
      else
        { original: io }
      end
    end
  end

end