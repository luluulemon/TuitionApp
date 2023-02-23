package vttp.course.tuition.server.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Service;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import vttp.course.tuition.server.repositories.ClassRepository;

@Service
public class ClassService {
    
    @Autowired
    private ClassRepository classRepo;

    public JsonArray getTeachers(){
        SqlRowSet rs = classRepo.getTeachers();
        JsonArrayBuilder teachersArray = Json.createArrayBuilder();

        while(rs.next()){
            teachersArray.add(      // Add each teacher as JsonObject to Array
                Json.createObjectBuilder().add("name", rs.getString("name"))
                                        .add("phoneNum", rs.getInt("phoneNum"))
                                        .add("teacherId", rs.getInt("teacherId"))
                                        .build()  
            );
        }
        return teachersArray.build();   // return Array of teachers
    }

    public void addClass(JsonObject classToAdd){
        classRepo.addClass(classToAdd);
    }
}
