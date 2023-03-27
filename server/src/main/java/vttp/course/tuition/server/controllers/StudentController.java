package vttp.course.tuition.server.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.JsonObject;
import vttp.course.tuition.server.services.StudentService;

@RestController
@RequestMapping("/api/student")
public class StudentController {
    
    @Autowired
    private StudentService studentSvc;

    @GetMapping("/details/{phoneNum}")
    public ResponseEntity<String> getStudentDetails(@PathVariable int phoneNum){
        JsonObject studentObj =  studentSvc.getStudentDetails(phoneNum);
        return ResponseEntity.ok(studentObj.toString());
    }
}
