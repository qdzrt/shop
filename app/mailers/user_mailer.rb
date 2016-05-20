class UserMailer < ApplicationMailer
  def welocome_email(user)
    @user = user
    
  end
end
