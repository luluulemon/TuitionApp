package vttp.course.tuition.server.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import jakarta.json.JsonObject;

import static vttp.course.tuition.server.repositories.Queries.*;

import java.time.LocalDate;

@Repository
public class EnrollmentRepository {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void addEnrollment(JsonObject enrolJson, LocalDate expiryDate){
        jdbcTemplate.update(SQL_ADD_ENROLLMENT, 
                    enrolJson.getInt("phoneNum"), enrolJson.getString("className"),
                    "current", expiryDate);
    }
}
