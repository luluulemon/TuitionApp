package vttp.course.tuition.server.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import jakarta.json.JsonObject;
import vttp.course.tuition.server.services.UserInsertException;

import static vttp.course.tuition.server.repositories.Queries.*;

import java.util.Date;

import vttp.course.tuition.server.services.UserInsertException;

@Repository
public class UserRepository {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional (rollbackFor = UserInsertException.class)
    public void addTeacher(JsonObject userJson) throws UserInsertException{
        int result = jdbcTemplate.update(SQL_ADD_USER, userJson.getInt("phoneNum"), 
                        userJson.getString("name"), "teacher", userJson.getString("name"));
        if(result==0){  throw new UserInsertException("Unable to insert user"); }

        int result2 = jdbcTemplate.update(SQL_ADD_TEACHER, userJson.getString("name"), 
                        userJson.getInt("phoneNum"), new Date());
        if(result2==0){  throw new UserInsertException("Unable to insert teacher"); }
    }

    @Transactional  (rollbackFor = UserInsertException.class)
    public void addStudent(JsonObject userJson) throws UserInsertException{
        int result = jdbcTemplate.update(SQL_ADD_USER, userJson.getInt("phoneNum"), 
                        userJson.getString("name"), "teacher", userJson.getString("name"));
        if(result==0){  throw new UserInsertException("Unable to insert user"); }

        int result2 = jdbcTemplate.update(SQL_ADD_STUDENT, userJson.getString("name"), 
                        userJson.getInt("phoneNum"), new Date());
        if(result2==0){  throw new UserInsertException("Unable to insert student"); }
    }
}
