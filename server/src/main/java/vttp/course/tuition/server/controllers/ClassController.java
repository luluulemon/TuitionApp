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
import org.springframework.web.bind.annotation.PutMapping;
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
                    .add("Update Msg", "CLASH with other Schedule")
                    .build().toString() ); }
        else{
            return ResponseEntity.ok(
                Json.createObjectBuilder()
                .add("Update Msg", "Schedule saved")
                .build().toString());
        }
    }

    @GetMapping("/getSchedules/{classYear}/{className}")    // Get Schedule for class
    @ResponseBody
    public ResponseEntity<String> getSchedule(
        @PathVariable String className, @PathVariable int classYear){
        JsonArray schedules = classSvc.getSchedules(classYear, className);
        return ResponseEntity.ok(schedules.toString());
    }

    @GetMapping("/getRecentSchedules")      // get upcoming week schedule for front page
    public ResponseEntity<String> getRecentSchedule(){
        return ResponseEntity.ok( classSvc.getRecentSchedules().toString() );
    }

    @PutMapping("/updateSchedule/{classYear}/{className}")
    @ResponseBody
    public void updateSchedule(@RequestBody String schedules, 
                                @PathVariable int classYear, @PathVariable String className){
        JsonReader reader = Json.createReader(new StringReader(schedules));
        JsonObject scheduleObj = reader.readObject(); 
        classSvc.updateSchedule(classYear, className, scheduleObj);
    }

    @GetMapping("/deleteSchedule/{classYear}/{className}/{dateTime}")
    @ResponseBody
    public void deleteSchedule(
        @PathVariable int classYear, @PathVariable String className, @PathVariable String dateTime){
        System.out.println("CHeck year: " + classYear);
        System.out.println("CHeck name: " + className);
        System.out.println("CHeck date: " + dateTime);
        classSvc.deleteSchedule(classYear, className, dateTime);
    }

    @GetMapping("/getStudents")
    @ResponseBody
    public ResponseEntity<String> getStudents(){
        JsonArray students = classSvc.getStudents();
        return ResponseEntity.ok(students.toString());
    }

    @GetMapping("/searchStudents/{searchString}")
    @ResponseBody
    public ResponseEntity<String> searchStudent(@PathVariable String searchString){
        JsonArray students = classSvc.getStudents(searchString);
        return ResponseEntity.ok(students.toString());
    }

    @GetMapping("/classDetails/{classYear}/{className}")
    @ResponseBody
    public ResponseEntity<String> getClassDetails(@PathVariable int classYear, @PathVariable String className){
        JsonObject detailsObj = classSvc.getClassDetails(classYear, className);
        return ResponseEntity.ok(detailsObj.toString());
    }


}
