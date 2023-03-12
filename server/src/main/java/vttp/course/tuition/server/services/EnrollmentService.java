package vttp.course.tuition.server.services;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.TemporalAdjusters;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Service;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import vttp.course.tuition.server.models.Enrollment;
import vttp.course.tuition.server.models.Student;
import vttp.course.tuition.server.repositories.EnrollmentRepository;

@Service
public class EnrollmentService {
    
    @Autowired
    private EnrollmentRepository enrolRepo;

    public int addEnrollment(JsonObject enrolJson){
        LocalDate lastDayOfMonth = LocalDate.now();
        // get expiry Date -> either end of Current Month, or Next month
        if(enrolJson.getString("expiryDate").equals("This"))
        {   lastDayOfMonth = LocalDate.now().with(TemporalAdjusters.lastDayOfMonth());    }
        else
        {    lastDayOfMonth = YearMonth.now().plusMonths(1).atEndOfMonth();   }
    
        return enrolRepo.addEnrollment(enrolJson, lastDayOfMonth);

    }

    public JsonArray getEnrollmentByClass(String className){
        JsonArrayBuilder enrolArray = Json.createArrayBuilder();
        SqlRowSet rs = enrolRepo.getEnrollmentByClass(className);

        while(rs.next()){
            enrolArray.add( Enrollment.enrolRsToJson(rs) );
        }

        return enrolArray.build();
    }

}
