package vttp.course.tuition.server.models;

import java.util.List;

import org.springframework.jdbc.support.rowset.SqlRowSet;

import jakarta.json.Json;
import jakarta.json.JsonObject;

public class Enrollment {
    
    private int phoneNum;
    private String className;
    private String status;
    private String expiryDate;

    private String name;
    private int studentId;


    public String getName() {        return name;    }
    public void setName(String name) {        this.name = name;    }

    public int getStudentId() {        return studentId;    }
    public void setStudentId(int studentId) {        this.studentId = studentId;    }

    public int getPhoneNum() {        return phoneNum;    }
    public void setPhoneNum(int phoneNum) {        this.phoneNum = phoneNum;    }

    public String getClassName() {        return className;    }
    public void setClassName(String className) {        this.className = className;    }

    public String getStatus() {        return status;    }
    public void setStatus(String status) {        this.status = status;    }

    public String getExpiryDate() {        return expiryDate;    }
    public void setExpiryDate(String expiryDate) {        this.expiryDate = expiryDate;    }

    public static JsonObject enrolWNameRsToJson(SqlRowSet rs){
        return
        Json.createObjectBuilder()
            .add("status", rs.getString("status"))
            .add("name", rs.getString("name"))
            .add("phoneNum", rs.getInt("phoneNum"))
            .add("expiryDate", rs.getString("expiryDate"))
            .add("studentId", rs.getInt("studentId"))
            .build();
    }

    public static JsonObject attendanceRSToJson(SqlRowSet rs, List<Integer> studentsPresent){
        return
        Json.createObjectBuilder()
            .add("status", rs.getString("status"))
            .add("name", rs.getString("name"))
            .add("phoneNum", rs.getInt("phoneNum"))
            .add("expiryDate", rs.getString("expiryDate"))
            .add("studentId", rs.getInt("studentId") ) 
            .add("present", studentsPresent.contains( rs.getInt("phoneNum") ) )
            .build();
    }

    public static JsonObject enrolRsToJson(SqlRowSet rs){
        return
        Json.createObjectBuilder()
            .add("status", rs.getString("status"))
            .add("className", rs.getString("className"))
            .add("classYear", rs.getInt("classYear"))
            .add("phoneNum", rs.getInt("phoneNum"))
            .add("expiryDate", rs.getString("expiryDate"))
            .add("startDate", rs.getString("startDate"))
            .build();
    }
}
