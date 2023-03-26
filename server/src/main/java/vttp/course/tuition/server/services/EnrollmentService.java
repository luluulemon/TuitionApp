package vttp.course.tuition.server.services;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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
        LocalDate startDate = LocalDate.now();
        String enrolStatus = "current";

        // get expiry Date -> either end of Current Month, or Next month
        if(enrolJson.getString("expiryDate").equals("This"))
        {   lastDayOfMonth = LocalDate.now().with(TemporalAdjusters.lastDayOfMonth());    }
        else
        {   enrolStatus = "pending";
            startDate = YearMonth.now().plusMonths(1).atDay(1);
            lastDayOfMonth = YearMonth.now().plusMonths(1).atEndOfMonth();   }
    
        return enrolRepo.addEnrollment(enrolJson, startDate, lastDayOfMonth, enrolStatus);

    }

    public JsonArray getEnrollmentByClass(int classYear, String className){
        JsonArrayBuilder enrolArray = Json.createArrayBuilder();
        SqlRowSet rs = enrolRepo.getEnrollmentByClass(classYear, className);

        while(rs.next()){
            enrolArray.add( Enrollment.enrolRsToJson(rs) );
        }
        return enrolArray.build();
    }

    public void validateEnrolStatus(){
        SqlRowSet rs = enrolRepo.getEnrollmentForValidation();
        List<Object[]> params = new ArrayList<>();

        while(rs.next()){
            if(rs.getString("status").equals("current"))
            {   params.add(new Object[]{ "expired", rs.getInt("phoneNum")} );   }
            else
            {   params.add(new Object[]{ "current", rs.getInt("phoneNum")} );   }
        }

        enrolRepo.batchUpdateStatus(params);
    }   

}
