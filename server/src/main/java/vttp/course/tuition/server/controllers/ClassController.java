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
import vttp.course.tuition.server.services.ClassService;

@Controller
@RequestMapping("/api/class")
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

    @PostMapping("/addSchedule")
    @ResponseBody
    public ResponseEntity<String> addSchedule(@RequestBody String newSchedule){
        JsonReader reader = Json.createReader(new StringReader(newSchedule));
        JsonObject scheduleJson = reader.readObject(); 
        int updateResult = classSvc.addSchedule(scheduleJson);

        if(updateResult == 0){  
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(
                    Json.createObjectBuilder()
                    .add("Update Msg", "Unable to insert schedule")
                    .build().toString() ); }
        else{
            return ResponseEntity.ok(
                Json.createObjectBuilder()
                .add("Update Msg", "Schedule saved")
                .build().toString());
        }
    }

    @GetMapping("/getSchedules/{className}")
    @ResponseBody
    public ResponseEntity<String> getSchedule(@PathVariable String className){
        JsonArray schedules = classSvc.getSchedules(className);
        return ResponseEntity.ok(schedules.toString());
    }


}
