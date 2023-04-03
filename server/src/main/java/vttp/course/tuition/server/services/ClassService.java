package vttp.course.tuition.server.services;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Service;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.json.JsonValue;
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
        Long lessonDuration = 60l;
        // add schedule for single, whole month, or whole year
        if(scheduleJson.getString("repeat").equals("No"))
            return classRepo.addSchedule(scheduleJson);
        
        List<LocalDateTime> currentSchedules = new ArrayList<>();
        JsonArray schedules = scheduleJson.getJsonArray("schedules");
        DateTimeFormatter scheduleFormatter = 
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        for(JsonValue s:schedules){    
            System.out.println(s);
            currentSchedules.add(                       // add existing schedules to check for clash
                LocalDateTime.parse(s.toString()        // parse String to required format
                                    .substring(1,17)
                                    .replace("T", " "), 
                                    scheduleFormatter) );
          }
        

        List<Object[]> params = new ArrayList<>();
        if(scheduleJson.getString("repeat").equals("Month"))
        {   DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            LocalDateTime firstSchedule = 
                LocalDateTime.parse(scheduleJson.getString("classDate"), formatter); 

            LocalDateTime endOfMonth = 
                firstSchedule.withDayOfMonth(firstSchedule      // set day of month
                                                .getMonth()
                                                .length(firstSchedule.toLocalDate().isLeapYear()));

            while(firstSchedule.isBefore(endOfMonth)){
                // get if new Schedule clashes with existing ( +- 1 hr )
                LocalDateTime sPlusOne = firstSchedule.plusMinutes(lessonDuration);
                LocalDateTime sMinusOne = firstSchedule.minusMinutes(lessonDuration);
                for(LocalDateTime s:currentSchedules){
                    if(s.isBefore(sPlusOne) && s.isAfter(sMinusOne)){
                        System.out.println("Clash with this: " + s);
                        return 0;
                    }
                }
                // add each schedule until it exceeds end Of Month
                params.add(new Object[]{ firstSchedule,
                                            scheduleJson.getString("className"),
                                            scheduleJson.getString("classYear"),
                                             } );
            firstSchedule = firstSchedule.plusDays(7);
            }
            classRepo.addSchedules(params);
        }

        // if(scheduleJson.getString("repeat").equals("Year"))
        // {   DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        //     LocalDateTime firstSchedule = 
        //         LocalDateTime.parse(scheduleJson.getString("classDate"), formatter); 

        //     LocalDateTime endOfYear = firstSchedule.withDayOfYear(365);

        //     while(firstSchedule.isBefore(endOfYear)){
        //         // add each schedule until it exceeds end Of Year
        //         params.add(new Object[]{ firstSchedule,
        //                                     scheduleJson.getString("className"),
        //                                     scheduleJson.getString("classYear"),
        //                                      } );
        //     firstSchedule = firstSchedule.plusDays(7);
        //     }
        //     classRepo.addSchedules(params);
        // }

        return 1;
    }

    public JsonArray getSchedules(int classYear, String className){
        JsonArrayBuilder scheduleArray = Json.createArrayBuilder();
        SqlRowSet rs = classRepo.getSchedules(classYear, className);
        while(rs.next()){   // List of class Dates
            scheduleArray.add(rs.getString("classDate"));
        }
        return scheduleArray.build();
    }

    public void updateSchedule(int classYear, String className, JsonObject scheduleJson){

        classRepo.updateSchedule(classYear, className,
                                    scheduleJson.getString("oldDateTime"),
                                    scheduleJson.getString("newDateTime"));
    }

    public void deleteSchedule(int classYear, String className, String dateTime){
        classRepo.deleteSchedule(classYear, className, dateTime);
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

    public JsonObject getClassDetails(int classYear, String className){
        SqlRowSet rs = classRepo.getClassDetails(classYear, className);
        rs.next();  // only one row of data
        System.out.println("Check name" + rs.getString("name"));

        return Json.createObjectBuilder()
                .add("teacherName", rs.getString("name"))
                .build();
    }
}
