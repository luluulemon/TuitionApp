package vttp.course.tuition.server.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Service;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import vttp.course.tuition.server.models.Student;
import vttp.course.tuition.server.repositories.ClassRepository;

@Service
public class ClassService {
    
    @Autowired
    private ClassRepository classRepo;

    public JsonArray getTeachers(){
        SqlRowSet rs = classRepo.getTeachers();
        JsonArrayBuilder teachersArray = Json.createArrayBuilder();

        while(rs.next()){
            teachersArray.add(      // Add each teacher as JsonObject to Array
                Json.createObjectBuilder().add("name", rs.getString("name"))
                                        .add("phoneNum", rs.getInt("phoneNum"))
                                        .add("teacherId", rs.getInt("teacherId"))
                                        .build()  
            );
        }
        return teachersArray.build();   // return Array of teachers
    }

    public void addClass(JsonObject classToAdd){
        classRepo.addClass(classToAdd);
    }

    public JsonObject getClasses(){
        SqlRowSet rs = classRepo.getClasses();

        JsonArrayBuilder classArray = Json.createArrayBuilder();    
        while(rs.next()){   
            classArray.add(                 // add each ClassJson to Array
            Json.createObjectBuilder()      // create JsonObject for Class
                    .add("className", rs.getString("className"))
                    .add("description", util.defaultValue(rs.getString("description"), "") )
                    .add("teacherId",  rs.getInt("teacherId"))
                    .add("classYear", rs.getInt("classYear"))
                    .build()
            );
        }

        JsonArrayBuilder classYearArray = Json.createArrayBuilder();
        SqlRowSet classYearRs = classRepo.getClassYears();
        while(classYearRs.next()){                   // Array for list of years
            classYearArray.add( classYearRs.getInt("classYear") );
        }

        return
        Json.createObjectBuilder().add("classArray", classArray)
                                    .add("classYearArray", classYearArray)
                                    .build();
    }

    public int addSchedule(JsonObject scheduleJson){
        return classRepo.addSchedule(scheduleJson);
    }

    public JsonArray getSchedules(String className){
        JsonArrayBuilder scheduleArray = Json.createArrayBuilder();
        SqlRowSet rs = classRepo.getSchedules(className);
        while(rs.next()){   // List of class Dates
            scheduleArray.add(rs.getString("classDate"));
        }
        return scheduleArray.build();
    }

    public void updateSchedule(JsonObject scheduleJson){

        classRepo.updateSchedule(scheduleJson.getString("oldDateTime"),
                                    scheduleJson.getString("newDateTime"));
    }

    public void deleteSchedule(String dateTime){
        classRepo.deleteSchedule(dateTime);
    }

    public JsonArray getStudents(){
        JsonArrayBuilder studentsArray = Json.createArrayBuilder();
        SqlRowSet rs = classRepo.getStudents();
        while(rs.next()){
            studentsArray.add( Student.studentRsToJson(rs) );
        }
        return studentsArray.build();
    }

    public JsonArray getStudents(String searchString){
        JsonArrayBuilder studentsArray = Json.createArrayBuilder();
        SqlRowSet rs = classRepo.getStudents(searchString);
        while(rs.next()){
            studentsArray.add( Student.studentRsToJson(rs) );
        }
        return studentsArray.build();
    }

    public JsonObject getClassDetails(String className){
        SqlRowSet rs = classRepo.getClassDetails(className);
        rs.next();  // only one row of data
        System.out.println("Check name" + rs.getString("name"));

        return Json.createObjectBuilder()
                .add("teacherName", rs.getString("name"))
                .add("totalSessions", rs.getInt("totalSessions"))
                .add("startDate", rs.getString("startDate"))
                .build();
    }
}
