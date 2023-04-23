package vttp.course.tuition.server.controllers;

import java.io.StringReader;
import java.util.Optional;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.amazonaws.Response;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import vttp.course.tuition.server.services.AuthService;

@RestController
@RequestMapping("api/auth")
public class AuthController {
    
    @Autowired
    private AuthService authSvc;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody String value){
        
        JsonReader reader = Json.createReader(new StringReader(value));
        JsonObject loginJson = reader.readObject(); 

        Optional<Boolean> loginOpt = authSvc.login(loginJson.getString("email"), 
                                                    loginJson.getString("password"));

        if(loginOpt.isEmpty()){ return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body(""); }
        if(loginOpt.get()){ return ResponseEntity.ok(null);    }
        else{   return ResponseEntity.status(HttpStatus.SC_UNAUTHORIZED).body(""); }
    }

    @PutMapping("/changePw")
    public ResponseEntity<String> changePw(@RequestBody String password){
        
        JsonReader reader = Json.createReader(new StringReader(password));
        JsonObject passwordJson = reader.readObject(); 

        String msg = authSvc.changePw(passwordJson);
        String respBody = Json.createObjectBuilder().add("msg", msg).build().toString();

        if(msg.equals("Password updated")){
            return ResponseEntity.ok( respBody);
        }

        return ResponseEntity.status(HttpStatus.SC_NOT_IMPLEMENTED)
                                .body(respBody);
    }
}
