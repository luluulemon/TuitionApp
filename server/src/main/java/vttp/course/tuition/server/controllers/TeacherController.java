package vttp.course.tuition.server.controllers;

import java.io.IOException;
import java.io.StringReader;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import vttp.course.tuition.server.services.TeacherService;
import vttp.course.tuition.server.services.UserService;

@RestController
@RequestMapping("/api/teacher")
public class TeacherController {
    
    @Autowired
    private TeacherService teacherSvc;
    
    @Autowired
    private UserService userSvc;

    @Autowired
    private AmazonS3 s3;


    @GetMapping("/details/{phoneNum}")      // get teacher details with classes
    public ResponseEntity<String> getTeacherDetails(@PathVariable int phoneNum){
        return ResponseEntity.ok( teacherSvc.getTeacherDetails(phoneNum).toString() );
    }


    @PostMapping("/uploadPic/{phoneNum}")   // add/update Teacher profile pic
    public void uploadProfilePic(@PathVariable int phoneNum, 
        @RequestPart MultipartFile image, @RequestPart String oldKey){
        
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(image.getContentType());
        metadata.setContentLength(image.getSize());
        
        String key = UUID.randomUUID().toString().substring(0, 8);
        System.out.println("CHeck oldkey: " + oldKey);

        try{
            PutObjectRequest putReq = new PutObjectRequest("lufirstbucket", 
                "profilePic/%s".formatted(key), image.getInputStream(), metadata);
                putReq = putReq.withCannedAcl(CannedAccessControlList.PublicRead);
                s3.putObject(putReq);
                if(!oldKey.equals("NA"))
                {   s3.deleteObject("lufirstbucket", "profilePic/%s".formatted(oldKey)); 
                
                }
                // insert image url to sql
                teacherSvc.updatePic("https://lufirstbucket.sgp1.digitaloceanspaces.com/profilePic/"+key, phoneNum);
        } catch(IOException e){     e.printStackTrace();    }
    }


    @PutMapping("editDetails/{oldPhoneNum}")
    public void editStudentDetails(@PathVariable int oldPhoneNum, @RequestBody String newDetails){
        JsonReader reader = Json.createReader(new StringReader(newDetails));
        JsonObject newDetailsJson = reader.readObject(); 
        if(newDetailsJson.getBoolean("phoneNumChanged"))
        {   teacherSvc.editTeacherDetails(oldPhoneNum, newDetailsJson); }

        else    // phoneNum unchanged
        { System.out.println("Only update email");
            {   userSvc.editUserEmail(oldPhoneNum, newDetailsJson.getString("email"));    }
        }
    }


}
