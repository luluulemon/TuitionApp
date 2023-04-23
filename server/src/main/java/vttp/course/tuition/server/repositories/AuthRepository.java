package vttp.course.tuition.server.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import jakarta.json.JsonObject;

import static vttp.course.tuition.server.repositories.Queries.*;

import java.util.Optional;

@Repository    
public class AuthRepository {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Optional<Boolean> login(String email, String password){
        // Check password for signing in
        SqlRowSet rs = jdbcTemplate.queryForRowSet(SQL_GET_PASSWORD, email);
        if(rs.next())      // get into data row -> shd hav only one row
        {   return Optional.of( password.equals(rs.getString("password")) );    }

        return Optional.empty();
    }


    public String changePw(JsonObject passwordJson){
        SqlRowSet rs = jdbcTemplate.queryForRowSet(SQL_GET_PASSWORD, passwordJson.getString("email"));
        rs.next();

        // check password for change password
        String password = rs.getString("password");
        if(password!=null){
            if(!password.equals(passwordJson.getString("password")))
            {    return "Password incorrect";   }
            if(password.equals(passwordJson.getString("newPassword")))
            {   return "Password unchanged";    }
        }

        jdbcTemplate.update(SQL_UPDATE_PASSWORD, passwordJson.getString("newPassword"), passwordJson.getString("email"));
        return "Password updated";
    }

}
