package vttp.course.tuition.server.controllers;


import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;

import jakarta.json.JsonObject;
import vttp.course.tuition.server.services.StudentService;

@RestController
@RequestMapping("/api/student")
public class StudentController {
    
    @Autowired
    private StudentService studentSvc;

    @Autowired
    private AmazonS3 s3;

    @GetMapping("/details/{phoneNum}")
    public ResponseEntity<String> getStudentDetails(@PathVariable int phoneNum){
        JsonObject studentObj =  studentSvc.getStudentDetails(phoneNum);
        return ResponseEntity.ok(studentObj.toString());
    }


    @PostMapping("/uploadPic/{phoneNum}")   // add/update Student profile pic
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
                studentSvc.updatePic("https://lufirstbucket.sgp1.digitaloceanspaces.com/profilePic/"+key, phoneNum);
        } catch(IOException e){     e.printStackTrace();    }
    }
}
