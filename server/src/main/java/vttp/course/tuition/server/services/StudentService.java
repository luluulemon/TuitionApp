package vttp.course.tuition.server.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;
import vttp.course.tuition.server.models.Enrollment;
import vttp.course.tuition.server.models.Student;
import vttp.course.tuition.server.repositories.AttendanceRepository;
import vttp.course.tuition.server.repositories.EnrollmentRepository;
import vttp.course.tuition.server.repositories.StudentRepository;
import vttp.course.tuition.server.repositories.UserRepository;

@Service
public class StudentService {
    
    @Autowired
    private StudentRepository studentRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private AttendanceRepository attendanceRepo;

    @Autowired
    private EnrollmentRepository enrolRepo;


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

    public void editStudentNotes(int phoneNum, String notes){
        studentRepo.editStudentNotes(phoneNum, notes);
    }

    @Transactional          // edit student details -> edit phoneNum require changing auth/attendance/enrol
    public void editStudentDetails(int oldPhoneNum, JsonObject newDetails){
        
        // insert new user with new number (cannot edit old user with foreign key constraints)
        userRepo.addOldStudent(newDetails); 
            
        studentRepo.editStudentDetails(oldPhoneNum, newDetails);
        attendanceRepo.editPhoneNum(oldPhoneNum, newDetails.getInt("phoneNum"));
        enrolRepo.editPhoneNum(oldPhoneNum, newDetails.getInt("phoneNum"));
        userRepo.deleteUser(oldPhoneNum);   // delete the old user
    }
}
