package vttp.course.tuition.server.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Service;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
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

    public void editUserEmail(int phoneNum, String email){  userRepo.editUserEmail(phoneNum, email);    }


    public JsonArray searchUser(String searchName){     // returns users with name starting with searchString

        SqlRowSet userRs = userRepo.searchUser(searchName);

        JsonArrayBuilder usersArray = Json.createArrayBuilder();
        while(userRs.next()){
            usersArray.add(
                Json.createObjectBuilder().add("name", userRs.getString("name"))
                                            .add("type", userRs.getString("type"))
                                            .add("phoneNum", userRs.getInt("phoneNum"))
                                            .add("email", userRs.getString("email"))
                                            .build()
            );
        }

        return usersArray.build();
    }
}
