package vttp.course.tuition.server.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;


import jakarta.json.JsonObject;

import static vttp.course.tuition.server.repositories.Queries.*;


@Repository
public class ClassRepository {
    
    // @Value("${spring.datasource.url}")
    // private String jdbcUrl;
    // @Value("${spring.datasource.username}")
    // private String username;
    // @Value("${spring.datasource.password}")
    // private String password;

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

    public void updateSchedule(String oldDateTime, String newDateTime){
        
        // try{
        // Connection connection = DriverManager.getConnection(jdbcUrl, username, password);
        // connection.setAutoCommit(false);
         
        // Statement statement = connection.createStatement(); 
        // statement.ad
        // statement.addBatch(SQL_UPDATE_SCHEDULE, newDateTime, oldDateTime);
        // statement.addBatch("INSERT INTO EMP_ADDRESS(ID, EMP_ID, ADDRESS) "
        // + "VALUES ('10','1','Address')");
        // statement.executeBatch();
        // } catch(SQLException SQLex){    SQLex.printStackTrace();    }
        jdbcTemplate.update(SQL_UPDATE_SCHEDULE, newDateTime, oldDateTime);
        jdbcTemplate.update(SQL_UPDATE_SCHEDULE_W_ATTENDANCE, newDateTime, oldDateTime);
    }

    public void deleteSchedule(String dateTime){
        jdbcTemplate.update(SQL_DELETE_SCHEDULE, dateTime);
        jdbcTemplate.update(SQL_DELETE_SCHEDULE_W_ATTENDANCE, dateTime);
    }

    public SqlRowSet getStudents(){
        return jdbcTemplate.queryForRowSet(SQL_GET_STUDENTS);
    }

    public SqlRowSet getStudents(String searchString){
        return jdbcTemplate.queryForRowSet(SQL_SEARCH_STUDENTS, searchString);
    }

    public SqlRowSet getClassDetails(String className){
        return jdbcTemplate.queryForRowSet(SQL_GET_CLASS_DETAILS, className);
    }



}
