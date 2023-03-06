package vttp.course.tuition.server.repositories;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import jakarta.json.JsonObject;

import static vttp.course.tuition.server.repositories.Queries.*;

@Repository
public class ClassRepository {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void addClass(JsonObject classToAdd){
        jdbcTemplate.update(SQL_ADD_CLASS, classToAdd.getString("className"), 
            classToAdd.getString("description"), 
            classToAdd.getInt("teacherId"), 0);
    }

    public SqlRowSet getTeachers(){
        return jdbcTemplate.queryForRowSet(SQL_GET_TEACHERS);
    }

    public SqlRowSet getClasses(){
        return jdbcTemplate.queryForRowSet(SQL_GET_CLASSES);
    }

    public int getTeacherId(int phoneNum){
        SqlRowSet rs = jdbcTemplate.queryForRowSet(SQL_GET_TEACHERID_FROM_NUM, phoneNum);
        rs.next();
        return rs.getInt("teacherId");
    }

    public int addSchedule(JsonObject scheduleJson){
        return jdbcTemplate.update(SQL_ADD_SCHEDULE, 
                            scheduleJson.getString("classDate"), 
                            scheduleJson.getString("className"));
    }

    public SqlRowSet getSchedules(String className){
        return jdbcTemplate.queryForRowSet(SQL_GET_SCHEDULES, className);
    }

    public SqlRowSet getStudents(){
        return jdbcTemplate.queryForRowSet(SQL_GET_STUDENTS);
    }
}
