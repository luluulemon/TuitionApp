package vttp.course.tuition.server.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Service;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;
import vttp.course.tuition.server.models.Enrollment;
import vttp.course.tuition.server.models.Student;
import vttp.course.tuition.server.repositories.StudentRepository;

@Service
public class StudentService {
    
    @Autowired
    private StudentRepository studentRepo;

    public JsonObject getStudentDetails(int phoneNum){
        SqlRowSet rs = studentRepo.getStudentDetails(phoneNum);
        if(rs.next()){
            JsonObjectBuilder studentObj = Json.createObjectBuilder();
            JsonArrayBuilder enrolArray = Json.createArrayBuilder();
            JsonObject student = Student.studentRsToJson(rs);

            enrolArray.add( Enrollment.enrolRsToJson(rs));

            while(rs.next()){
                enrolArray.add( Enrollment.enrolRsToJson(rs));
            }

            return studentObj.add("studentDetails", student)
                                .add("enrolArray", enrolArray)
                                .build();
        }

        return null;
    }
}
