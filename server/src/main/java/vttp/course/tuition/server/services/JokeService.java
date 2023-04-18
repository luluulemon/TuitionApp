package vttp.course.tuition.server.services;

import java.io.StringReader;
import java.util.Optional;

import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;

@Service
public class JokeService {
    
    public Optional<JsonObject> getJoke(){
        String url = "https://official-joke-api.appspot.com/jokes/random";
        RequestEntity req = RequestEntity.get(url).build();

        RestTemplate template = new RestTemplate();
        ResponseEntity<String> resp = template.exchange(req, String.class);

        JsonReader reader = Json.createReader(new StringReader(resp.getBody()));
        JsonObject results = reader.readObject(); 

        return Optional.of(results);
    }
    

}
