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
        
        SqlRowSet enrolRs = studentRepo.getStudentEnrollments(phoneNum);
        JsonArrayBuilder enrolArray = Json.createArrayBuilder();
        while(enrolRs.next()){
            enrolArray.add( Enrollment.enrolRsToJson(enrolRs));
        }

        SqlRowSet studentDetailRs = studentRepo.getStudentDetails(phoneNum);
        studentDetailRs.next();

        return              // combine student details with enrollment
            Student.studentWEnrolRsToJson(studentDetailRs, enrolArray.build());
    }

    public void updatePic(String picUrl, int phoneNum){
        studentRepo.updateStudentPic(picUrl, phoneNum);
    }
}
