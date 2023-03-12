package vttp.course.tuition.server.controllers;

import java.io.StringReader;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import vttp.course.tuition.server.services.AttendanceService;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
    
    @Autowired
    private AttendanceService attendanceSvc;

    @PostMapping("/add")
    public ResponseEntity<String> markAttendance(@RequestBody String attendanceJsonString){
        JsonReader reader = Json.createReader(new StringReader(attendanceJsonString));
        JsonObject attendanceJson = reader.readObject(); 

        attendanceSvc.markAttendance(attendanceJson);
        return ResponseEntity.ok(Json.createObjectBuilder()
                                        .add("Insert msg", "Attendance added")
                                        .build().toString());
    }

    @GetMapping("/get/{className}/{dateTime}")
    public ResponseEntity<String> getAttendance(@PathVariable String className, @PathVariable String dateTime){

        JsonArray attendJson = attendanceSvc.getAttendance(className, dateTime);
    
        return ResponseEntity.ok(attendJson.toString());
    }
}
