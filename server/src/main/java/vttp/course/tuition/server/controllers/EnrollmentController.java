package vttp.course.tuition.server.controllers;

import java.io.StringReader;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.json.Json;
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
    public void addEnrollment(@RequestBody String enrollment){
        JsonReader reader = Json.createReader(new StringReader(enrollment));
        JsonObject enrolJson = reader.readObject(); 

        enrolSvc.addEnrollment(enrolJson);
    }
}
