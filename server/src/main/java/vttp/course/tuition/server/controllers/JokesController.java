package vttp.course.tuition.server.controllers;

import java.util.Optional;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.JsonObject;
import vttp.course.tuition.server.services.JokeService;

@RestController
@RequestMapping("/api/jokes")
public class JokesController {
    
    @Autowired
    private JokeService jokeSvc;

    @GetMapping("/getJoke")
    public ResponseEntity<String> getJoke(){
        
        Optional<JsonObject> opJoke = jokeSvc.getJoke();
        if(opJoke.isEmpty())
        {    return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body(null);   }

        return ResponseEntity.ok(opJoke.get().toString());
    }
}
