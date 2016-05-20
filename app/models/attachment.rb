class Attachment < ActiveRecord::Base
  has_attached_file :image, styles: {:small => "100*100"}
  # validates_attachment_presence :image
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/
  validates_attachment_size :image, less_than: { in: 0..10.kilobytes  }

  has_attached_file :document
  # validates_attachment_presence :document
  validates_attachment_content_type :document, :content_type => [ 'application/pdf','text/plain']

  has_attached_file :audio
  # validates_attachment_presence :audio
  validates_attachment_content_type :audio, :content_type => [ 'audio/mp3','audio/mpeg','video/mp4']


  include Rails.application.routes.url_helpers

  def to_jq_upload
    {
        "name" => read_attribute(:attachment_file_name),
        "size" => read_attribute(:attachment_file_size),
        "url" => attachment.url(:original),
        "delete_url" => attachment_path(self),
        "delete_type" => "DELETE"
    }
  end
end
