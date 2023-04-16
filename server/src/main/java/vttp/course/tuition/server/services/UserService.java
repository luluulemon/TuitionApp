package vttp.course.tuition.server.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.json.JsonObject;
import vttp.course.tuition.server.repositories.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepo;

    public void addTeacher(JsonObject userJson) throws UserInsertException{
        userRepo.addTeacher(userJson);
    }

    public void addStudent(JsonObject userJson) throws UserInsertException{
        userRepo.addStudent(userJson);
    }

    public void addAdmin(JsonObject userJson){  userRepo.addAdmin(userJson);    }

    public void editUserEmail(int phoneNum, String email){  userRepo.editUserEmail(phoneNum, email);}
}
