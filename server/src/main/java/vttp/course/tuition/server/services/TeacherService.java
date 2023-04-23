package vttp.course.tuition.server.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.json.Json;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import vttp.course.tuition.server.models.Teacher;
import vttp.course.tuition.server.repositories.TeacherRepository;
import vttp.course.tuition.server.repositories.UserRepository;

@Service
public class TeacherService {
    
    @Autowired
    private TeacherRepository teacherRepo;

    @Autowired
    private UserRepository userRepo;


    public JsonObject getTeacherDetails(int phoneNum){
        // get teacher details, together with class list
        SqlRowSet classesRs = teacherRepo.getTeacherClasses(phoneNum);
        JsonArrayBuilder classesArray = Json.createArrayBuilder();
        while(classesRs.next()){        // add each class to Array
            classesArray.add( Json.createObjectBuilder()
                                .add("className", classesRs.getString("className"))
                                .add("classYear", classesRs.getInt("classYear"))
                            );
        }

        SqlRowSet teacherDetailRs = teacherRepo.getTeacherDetails(phoneNum);
        teacherDetailRs.next();

        return              // combine teacher details with classes
            Teacher.rsToJsonWithClasses(teacherDetailRs, classesArray.build());
    }

    public void updatePic(String picUrl, int phoneNum){
        teacherRepo.updateStudentPic(picUrl, phoneNum);
    }


    @Transactional       // edit teacher details -> edit phoneNum require changing auth/attendance/enrol
    public void editTeacherDetails(int oldPhoneNum, JsonObject newDetails){
        
        // Get old password
        SqlRowSet rs = teacherRepo.getTeacherPassword(oldPhoneNum);
        rs.next();

        // insert new user with new number (cannot edit old user with foreign key constraints)
        userRepo.addExistingTeacher(newDetails, rs.getString("password")); 
        
        // edit phoneNum in teachers table
        teacherRepo.editTeacherDetails(oldPhoneNum, newDetails);
        userRepo.deleteUser(oldPhoneNum);   // delete the old user
    }
}
