package vttp.course.tuition.server.controllers;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student")
public class StudentController {
    
    @GetMapping("/details")
    public ResponseEntity<String> getStudentDetails(){

        return null;
    }
}
