package vttp.course.tuition.server.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import jakarta.json.JsonObject;

import static vttp.course.tuition.server.repositories.Queries.*;

@Repository
public class AttendanceRepository {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void markAttendance(JsonObject attendanceJson){
        jdbcTemplate.update(SQL_ADD_ATTENDANCE,  
            attendanceJson.getString("classDate"),
            attendanceJson.getString("className"),
            attendanceJson.getInt("phoneNum"),
            attendanceJson.getString("classYear"));
    }

    public SqlRowSet getAttendance(String className, String dateTime){
        return jdbcTemplate.queryForRowSet(SQL_GET_ATTENDANCE, className, dateTime);
    }


}
