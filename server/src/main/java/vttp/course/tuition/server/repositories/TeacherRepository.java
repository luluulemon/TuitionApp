package vttp.course.tuition.server.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import jakarta.json.JsonObject;

import static vttp.course.tuition.server.repositories.Queries.*;

@Repository
public class TeacherRepository {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public SqlRowSet getTeacherDetails(int phoneNum){
        return jdbcTemplate.queryForRowSet(SQL_GET_TEACHER_DETAILS, phoneNum);
    }

    public SqlRowSet getTeacherClasses(int phoneNum){
        return jdbcTemplate.queryForRowSet(SQL_GET_TEACHER_CLASSES, phoneNum);
    }

    public void updateStudentPic(String picUrl, int phoneNum){
        jdbcTemplate.update(SQL_UPDATE_TEACHER_PIC, picUrl, phoneNum);
    }

    public void editTeacherDetails(int oldPhoneNum, JsonObject newDetails){
        // update phoneNum in teachers
        jdbcTemplate.update(SQL_UPDATE_TEACHER_DETAILS, 
                            newDetails.getInt("phoneNum"),
                            oldPhoneNum );      
    }

    public SqlRowSet getTeacherPassword(int phoneNum){
        return jdbcTemplate.queryForRowSet(SQL_GET_TEACHER_PASSWORD, phoneNum);
    }
}
