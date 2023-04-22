package vttp.course.tuition.server.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;
import static vttp.course.tuition.server.repositories.Queries.*;

import java.util.Optional;

@Repository    
public class AuthRepository {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Optional<Boolean> login(String email, String password){
        
        SqlRowSet rs = jdbcTemplate.queryForRowSet(SQL_GET_PASSWORD, email);
        if(rs.next())      // get into data row -> shd hav only one row
        {   return Optional.of( password.equals(rs.getString("password")) );    }

        return Optional.empty();
    }
}
