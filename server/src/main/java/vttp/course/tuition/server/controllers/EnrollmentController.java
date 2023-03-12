package vttp.course.tuition.server.controllers;

import java.io.StringReader;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import vttp.course.tuition.server.services.EnrollmentService;

@Controller
@RequestMapping("/api/enrol")
public class EnrollmentController {
    
    @Autowired
    private EnrollmentService enrolSvc;

    @PostMapping("/newEnrollment")
    @ResponseBody
    public ResponseEntity<String> addEnrollment(@RequestBody String enrollment){
        JsonReader reader = Json.createReader(new StringReader(enrollment));
        JsonObject enrolJson = reader.readObject(); 

        int insertResult = enrolSvc.addEnrollment(enrolJson);
        if(insertResult==0)
        {   return ResponseEntity.ok(Json.createObjectBuilder()
                                        .add("insert Msg", "Already Exists")
                                        .build().toString()) ;   }
        return ResponseEntity.ok(Json.createObjectBuilder()
                                    .add("insert Msg", "Inserted to %s".formatted(enrolJson.getString("className")))
                                    .build().toString()) ;
    }

    @GetMapping("/getEnrollments")
    @ResponseBody
    public ResponseEntity<String> getEnrollmentByClass(@RequestParam String className){
        JsonArray enrolArray = enrolSvc.getEnrollmentByClass(className.replace("%20", " "));
              
        return ResponseEntity.ok(enrolArray.toString());
    }
}
