require 'sequel'
module SQLQuery

  extend self #让实例方法同时为类方法,便可使用 SQLQuery.sql_templet

  def sql_t(t_name)
    File.read Rails.root.join('db','sqls',t_name)
  end

end
Dir[File.join(File.dirname(__FILE__),'sql_query','*.rb')].each { |f| require f }