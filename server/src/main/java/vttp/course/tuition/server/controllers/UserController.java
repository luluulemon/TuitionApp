package vttp.course.tuition.server.controllers;

import java.io.StringReader;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import vttp.course.tuition.server.services.UserInsertException;
import vttp.course.tuition.server.services.UserService;

@Controller
@RequestMapping("/api/user")
public class UserController {
    
    @Autowired
    private UserService userSvc;

    @PostMapping("addUser")
    @ResponseBody
    public ResponseEntity<String> addUser(@RequestBody String newUser){
        JsonReader reader = Json.createReader(new StringReader(newUser));
        JsonObject userJson = reader.readObject(); 

        try{
            if(userJson.getString("type").equals("teacher"))
            {   userSvc.addTeacher(userJson);   }

            if(userJson.getString("type").equals("student"))
            {   userSvc.addStudent(userJson);   }

            if(userJson.getString("type").equals("admin"))
            {   userSvc.addAdmin(userJson);     }
        }
        catch(UserInsertException e){   
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
                                .body(Json.createObjectBuilder().add("Insert Msg", e.getMessage())
                                .build().toString());
        }

        return ResponseEntity.ok( 
            Json.createObjectBuilder()
                .add("Insert Msg", 
                    "added %s %s".formatted(userJson.getString("type"), userJson.getString("name")))
                .build().toString());
    }


    @GetMapping("/searchUser/{searchName}")
    public ResponseEntity<String> searchUser(@PathVariable String searchName){
        return ResponseEntity.ok(userSvc.searchUser(searchName).toString() );
    }
}
