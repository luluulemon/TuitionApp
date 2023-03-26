package vttp.course.tuition.server.services;

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
import vttp.course.tuition.server.repositories.EnrollmentRepository;

@Service
public class AttendanceService {
    
    @Autowired
    private AttendanceRepository attendanceRepo;

    @Autowired
    private EnrollmentRepository enrollmentRepo;


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


}
