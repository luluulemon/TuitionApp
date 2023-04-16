package vttp.course.tuition.server.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import jakarta.json.JsonObject;

import static vttp.course.tuition.server.repositories.Queries.*;

import java.time.LocalDate;
import java.util.List;

@Repository
public class EnrollmentRepository {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public int addEnrollment(JsonObject enrolJson, LocalDate startDate, 
                                LocalDate expiryDate, String enrolStatus){
        // check if there is already an existing enrollment --> Double check: alr check at frontend
        SqlRowSet rs = jdbcTemplate.queryForRowSet(SQL_GET_EXISTING_ENROLLMENT, 
                                    enrolJson.getInt("phoneNum"), 
                                    enrolJson.getString("className"),
                                    expiryDate);
        if(rs.next()){  return 0;   }

        jdbcTemplate.update(SQL_ADD_ENROLLMENT, 
                    enrolJson.getInt("phoneNum"), 
                    enrolJson.getString("className"),
                    Integer.parseInt( enrolJson.getString("classYear") ), 
                    enrolStatus,
                    expiryDate,
                    startDate);
        return 1;
    }

    public SqlRowSet getEnrollmentByClass(int classYear, String className){
        return jdbcTemplate.queryForRowSet(SQL_GET_ENROLLMENT_BY_CLASS, classYear, className, "pending") ;
    }

    public SqlRowSet getEnrollmentForValidation(){
        return jdbcTemplate.queryForRowSet(SQL_GET_ENROL_BY_STATUS);
    }

    public void batchUpdateStatus(List<Object[]> params){
        jdbcTemplate.batchUpdate(SQL_UPDATE_STATUSSS, params);
    }

    public void extendEnrollment(LocalDate newExpiryDate, JsonObject enrolJson){    
         // for extending enrollment by one month
        jdbcTemplate.update(SQL_EXTEND_ENROLLMENT, 
                            newExpiryDate, 
                            enrolJson.getInt("phoneNum"),
                            enrolJson.getInt("classYear"),
                            enrolJson.getString("className"));
    }

    public void editPhoneNum(int oldPhoneNum, int newPhoneNum){
        jdbcTemplate.update(SQL_UPDATE_ENROLLMENT_PHONENUM, newPhoneNum, oldPhoneNum);
    }
}
