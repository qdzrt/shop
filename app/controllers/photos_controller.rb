class PhotosController < ApplicationController
  before_action :set_photo, only: [:show, :edit, :update, :destroy]
  before_action :set_product
  def index
    @photos = Photo.all
  end

  def show
  end

  def new
    @photo = Photo.new
  end

  def edit
  end

  def create
    #single
    # view: <%= f.file_field :avatar, class: 'file' %>
    @product = Product.find(photo_params[:product_id])
    @product.photos.create(photo_params)


    #multiple
    # file_arr = params[:file]
    # @product = Product.find(photo_params[:product_id])
    #
    # source_dir_path = Rails.root.join('tmp','files').to_s
    # FileUtils.makedirs source_dir_path unless File.exists? source_dir_path
    # file_arr.each do |file|
    #   if file.is_a?(String)
    #     File.open("#{Rails.root}/tmp/files/#{file}", 'wb'){ |f| f.write file.read }
    #     @product.photos.create(avatar: File.open(Rails.root.join('tmp','files',"#{file}")))
    #   else
    #     File.open("#{Rails.root}/tmp/files/#{file.original_filename}", 'wb'){ |f| f.write file.read }
    #     @product.photos.create(avatar: File.open(Rails.root.join('tmp','files',"#{file.original_filename}")))
    #   end
    # end
    # FileUtils.rm_r source_dir_path if File.directory? source_dir_path

    redirect_to products_path

    # @photo = Photo.create(photo_params)
    # if @photo.save
    #   flash[:notice] = "已创建"
    #   redirect_to photos_path
    # else
    #   render :new
    # end
  end

  def update

    @photo.update(photo_params)
    redirect_to photos_path
  end

  def destroy
    @photo.destroy
    respond_to do |format|
      format.html { redirect_to photos_url, notice: 'Photo was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    def set_product
      # @product = Product.find(params[:productId])
    end

    def set_photo
      @photo = Photo.find(params[:id])
    end

    def photo_params
      params.require(:photo).permit(:product_id, :avatar)
    end
end
