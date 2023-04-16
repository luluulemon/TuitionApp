package vttp.course.tuition.server.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import jakarta.json.JsonObject;

import static vttp.course.tuition.server.repositories.Queries.*;

@Repository
public class StudentRepository {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public SqlRowSet getStudentDetails(int phoneNum){
        return jdbcTemplate.queryForRowSet(SQL_GET_STUDENT_DETAILS, phoneNum);
    }

    public SqlRowSet getStudentEnrollments(int phoneNum){
        return jdbcTemplate.queryForRowSet(SQL_GET_STUDENT_ENROLMENTS, phoneNum);
    }

    public void updateStudentPic(String picUrl, int phoneNum){
        jdbcTemplate.update(SQL_UPDATE_STUDENT_PIC, picUrl, phoneNum);
    }

    public void editStudentNotes(int phoneNum, String notes){
        jdbcTemplate.update(SQL_UPDATE_STUDENT_NOTES, notes, phoneNum);
    }

    public void editStudentDetails(int oldPhoneNum, JsonObject newDetails){
        jdbcTemplate.update(SQL_UPDATE_STUDENT_DETAILS, 
                            newDetails.getInt("phoneNum"),
                            newDetails.getString("notes"),
                            oldPhoneNum );
    }
}
