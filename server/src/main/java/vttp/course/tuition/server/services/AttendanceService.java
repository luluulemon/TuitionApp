package vttp.course.tuition.server.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Service;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import vttp.course.tuition.server.models.Enrollment;
import vttp.course.tuition.server.repositories.AttendanceRepository;
import vttp.course.tuition.server.repositories.ClassRepository;
import vttp.course.tuition.server.repositories.EnrollmentRepository;

@Service
public class AttendanceService {
    
    @Autowired
    private AttendanceRepository attendanceRepo;

    @Autowired
    private EnrollmentRepository enrollmentRepo;

    @Autowired
    private ClassRepository classRepo;


    public void markAttendance(JsonObject attendanceJson){
        attendanceRepo.markAttendance(attendanceJson);
        
    }

    public JsonArray getAttendance(int classYear, String className, String dateTime){
        List<Integer> studentsPresent = new LinkedList<>();
        SqlRowSet rs = attendanceRepo.getAttendance(className, dateTime);
        while(rs.next()){
            studentsPresent.add( rs.getInt("phoneNum") );   // phoneNums of students present
        }

        JsonArrayBuilder attendanceArray = Json.createArrayBuilder();
        SqlRowSet enrolsRS = enrollmentRepo.getEnrollmentByClass(classYear, className);
        while(enrolsRS.next()){     // add classStudents together with their attendance
            attendanceArray.add( Enrollment.attendanceRSToJson(enrolsRS, studentsPresent) );
        }
        
        return attendanceArray.build();
    }

    public void getClassAttendance(int classYear, String className){
        SqlRowSet enrolRs = enrollmentRepo.getEnrollmentByClass(classYear, className);
        SqlRowSet attendanceRs = attendanceRepo.getClassAttendance(classYear, className);
        SqlRowSet scheduleRs = classRepo.getSchedules(classYear, className);

        List<LocalDateTime> schedulesList = new ArrayList<>();
        HashMap<Integer, String> nameMap = new HashMap<>();
        HashMap<Integer, List<LocalDateTime>> enrolMap = new HashMap<>();
        HashMap<Integer, List<LocalDateTime>> attendanceMap = new HashMap<>();

        // fill up schedules list
        while(scheduleRs.next()){
            schedulesList.add 
                (LocalDateTime.parse( scheduleRs.getString("classDate") )   );
        }
        System.out.println("Check schedule: " + schedulesList.get(0));
        System.out.println(schedulesList);
        
        // fill up enrollment Map
        while(enrolRs.next()){
            // fill up nameMap -> get Name from phoneNum later
            int phoneNum = enrolRs.getInt("phoneNum");
            nameMap.put(phoneNum, enrolRs.getString("name"));

            // run through each schedule to fill up enrollment of each student
            for(LocalDateTime s:schedulesList){
                // compare DateTime to see if schedule is within enrollment
                if(LocalDate.parse(enrolRs.getString("startDate")).atTime(23, 59).isBefore(s)){
                    if(LocalDate.parse(enrolRs.getString("expiryDate")).atTime(23, 59).isAfter(s)){
                        
                        if(enrolMap.containsKey(phoneNum))
                        {   enrolMap.get(phoneNum).add(s);  }
                        else
                        {   List<LocalDateTime> enrols = new ArrayList<>();
                            enrols.add(s);
                            enrolMap.put(phoneNum, enrols);  }
                    }
                }
            }
        }

        // fill up attendance Map
        while(attendanceRs.next()){
            int phoneNum = attendanceRs.getInt("phoneNum");
            if(attendanceMap.containsKey(phoneNum)){
                attendanceMap.get(phoneNum)
                                .add(LocalDateTime.parse( attendanceRs.getString("classDate")) );
            }
            else{
                List<LocalDateTime> attendanceList = new ArrayList<>();
                attendanceList.add(LocalDateTime.parse( attendanceRs.getString("classDate")) );
                attendanceMap.put(phoneNum, attendanceList);
            }
        }

    }


}
