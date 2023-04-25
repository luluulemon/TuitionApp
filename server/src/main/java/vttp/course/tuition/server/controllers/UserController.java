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
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import vttp.course.tuition.server.services.EmailService;
import vttp.course.tuition.server.services.UserInsertException;
import vttp.course.tuition.server.services.UserService;

@Controller
@RequestMapping("/api/user")
public class UserController {
    
    @Autowired
    private UserService userSvc;

    @Autowired
    private EmailService emailSvc;

    @PostMapping("addUser")
    @ResponseBody
    public ResponseEntity<String> addUser(@RequestBody String newUser){
        JsonReader reader = Json.createReader(new StringReader(newUser));
        JsonObject userJson = reader.readObject(); 
        System.out.println("Check email: " + userJson.getString("email"));

        if(userSvc.searchEmail(userJson.getString("email")) )
        {   
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
            .body(Json.createObjectBuilder().add("Insert Msg", "Email already exists")
            .build().toString());
        }

        try{        // Add to auth & teachers
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

        // Send password to new user        // send email for teacher/admin
        if(userJson.getString("type").equals("admin") ||          
            userJson.getString("type").equals("teacher")    )
        {   emailSvc.sendSimpleMessage(userJson.getString("email"), 
            "NewtonLab: Welcome %s".formatted(userJson.getString("name")), 
            "Password: %s\n\nPlease change your password on login".formatted(userJson.getString("name")));
        }

        return ResponseEntity.ok( 
            Json.createObjectBuilder()
                .add("Insert Msg", 
                    "added %s %s".formatted(userJson.getString("type"), userJson.getString("name")))
                .build().toString());
    }


    @GetMapping("/searchUser/{searchName}")
    public ResponseEntity<String> searchUser(@PathVariable String searchName){
        JsonArray usersArray = userSvc.searchUser(searchName);

        if(usersArray.size()==0){   return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  }
        
        return ResponseEntity.ok(userSvc.searchUser(searchName).toString() );
    }


    @GetMapping("/email")   // test endpoint
    public void testEmail(){
        emailSvc.sendSimpleMessage("chen_luwei@yahoo.com.sg", "Test only", "Test Msg");
        System.out.println("Sent email");
    }
}
