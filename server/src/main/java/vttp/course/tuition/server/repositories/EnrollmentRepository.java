package vttp.course.tuition.server.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import jakarta.json.JsonObject;

import static vttp.course.tuition.server.repositories.Queries.*;

import java.time.LocalDate;

@Repository
public class EnrollmentRepository {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public int addEnrollment(JsonObject enrolJson, LocalDate expiryDate){
        // check if there is already an existing enrollment
        SqlRowSet rs = jdbcTemplate.queryForRowSet(SQL_GET_EXISTING_ENROLLMENT, 
                                    enrolJson.getInt("phoneNum"), expiryDate);
        if(rs.next()){  return 0;   }

        jdbcTemplate.update(SQL_ADD_ENROLLMENT, 
                    enrolJson.getInt("phoneNum"), enrolJson.getString("className"),
                    "current", expiryDate);
        return 1;
    }

    public SqlRowSet getEnrollmentByClass(String className){
        return jdbcTemplate.queryForRowSet(SQL_GET_ENROLLMENT_BY_CLASS, className);
    }
}
