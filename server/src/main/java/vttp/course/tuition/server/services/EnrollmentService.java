package vttp.course.tuition.server.services;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.TemporalAdjusters;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.json.JsonObject;
import vttp.course.tuition.server.repositories.EnrollmentRepository;

@Service
public class EnrollmentService {
    
    @Autowired
    private EnrollmentRepository enrolRepo;

    public void addEnrollment(JsonObject enrolJson){
        LocalDate lastDayOfMonth = LocalDate.now();
        // get expiry Date
        if(enrolJson.getString("expiryDate").equals("This"))
        {   lastDayOfMonth = LocalDate.now().with(TemporalAdjusters.lastDayOfMonth());    }
        else
        {    lastDayOfMonth = YearMonth.now().plusMonths(1).atEndOfMonth();   }
    
        enrolRepo.addEnrollment(enrolJson, lastDayOfMonth);
    }

}
