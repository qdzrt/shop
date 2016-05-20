module SQLQuery
  module CS
    DB = Sequel.connect(Rails.configuration.cs_db[Rails.env.to_sym])

    extend self

    def cs_info
      sql = SQLQuery::sql_t 'cs_user.sql'
      DB.fetch sql, &block
    end
  end
end