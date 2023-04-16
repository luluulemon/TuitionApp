package vttp.course.tuition.server.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;


import jakarta.json.JsonObject;

import static vttp.course.tuition.server.repositories.Queries.*;

import java.time.Year;
import java.util.List;


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
        int classYear;
        if(classToAdd.getString("classYear").equals("thisYear"))
        {   classYear = Year.now().getValue(); }
        else
        {   classYear = Year.now().getValue() + 1;  }
        jdbcTemplate.update(SQL_ADD_CLASS, classToAdd.getString("className"), 
            classToAdd.getString("description"), 
            classToAdd.getInt("teacherId"), classYear);
    }

    public SqlRowSet getTeachers(){
        return jdbcTemplate.queryForRowSet(SQL_GET_TEACHERS);
    }

    public SqlRowSet getClasses(){
        return jdbcTemplate.queryForRowSet(SQL_GET_CLASSES);
    }

    public SqlRowSet getClassYears(){
        return jdbcTemplate.queryForRowSet(SQL_GET_UNIQUECLASSYEAR);
    }

    public int getTeacherId(int phoneNum){
        SqlRowSet rs = jdbcTemplate.queryForRowSet(SQL_GET_TEACHERID_FROM_NUM, phoneNum);
        rs.next();
        return rs.getInt("teacherId");
    }

    public int addSchedule(JsonObject scheduleJson){
        return jdbcTemplate.update(SQL_ADD_SCHEDULE, 
                            scheduleJson.getString("classDate"), 
                            scheduleJson.getString("className"),
                            Integer.parseInt( scheduleJson.getString("classYear")) );
    }

    public void addSchedules(List<Object[]> params){    // add repeat schedules (repeat month/year)
        jdbcTemplate.batchUpdate(SQL_ADD_SCHEDULE, params);
    }

    public SqlRowSet getSchedules(int classYear, String className){ // get schedules for class
        return jdbcTemplate.queryForRowSet(SQL_GET_SCHEDULES, classYear, className);
    }

    public SqlRowSet getRecentSchedules(String startDate, String cutOffDate){
        return jdbcTemplate.queryForRowSet(SQL_GET_RECENT_SCHEDULES, startDate, cutOffDate);
    }

    public void updateSchedule(int classYear, String className,
                                 String oldDateTime, String newDateTime){
        
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
        jdbcTemplate.update(SQL_UPDATE_SCHEDULE, newDateTime, classYear, className, oldDateTime);
        jdbcTemplate.update(SQL_UPDATE_SCHEDULE_W_ATTENDANCE, newDateTime, classYear, className, oldDateTime);
    }

    public void deleteSchedule(int classYear, String className, String dateTime){
        jdbcTemplate.update(SQL_DELETE_SCHEDULE, classYear, className, dateTime);
        jdbcTemplate.update(SQL_DELETE_SCHEDULE_W_ATTENDANCE, dateTime);
    }

    public SqlRowSet getStudents(){
        return jdbcTemplate.queryForRowSet(SQL_GET_STUDENTS);
    }

    public SqlRowSet getStudents(String searchString){
        return jdbcTemplate.queryForRowSet(SQL_SEARCH_STUDENTS, searchString);
    }

    public SqlRowSet getClassDetails(int classYear, String className){
        return jdbcTemplate.queryForRowSet(SQL_GET_CLASS_DETAILS, classYear, className);
    }



}
