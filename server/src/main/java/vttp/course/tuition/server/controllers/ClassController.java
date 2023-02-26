package vttp.course.tuition.server.controllers;

import java.io.StringReader;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import vttp.course.tuition.server.services.ClassService;

@Controller
public class ClassController {
    
    @Autowired
    private ClassService classSvc;

    @GetMapping("/getClasses")
    @ResponseBody
    public ResponseEntity<String> getClasses(){
        return ResponseEntity.ok(classSvc.getClasses().toString() );
    }


    @PostMapping("/addClass")
    @ResponseBody
    public void addClass(@RequestBody String classString){
        System.out.println("Check endpoint: Class added ***********");
        JsonReader reader = Json.createReader(new StringReader(classString));
        JsonObject c = reader.readObject(); 
        classSvc.addClass(c);
    }

    @GetMapping("/getTeachers")
    @ResponseBody
    public ResponseEntity<String> getTeachers(){

        return ResponseEntity.ok( classSvc.getTeachers().toString());
    }


}
