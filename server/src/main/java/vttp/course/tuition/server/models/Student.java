package vttp.course.tuition.server.models;

import org.springframework.jdbc.support.rowset.SqlRowSet;

import jakarta.json.Json;
import jakarta.json.JsonObject;

public class Student {
    
    private int studentId;
    private String name;
    private int phoneNum;
    private String joinDate;

    public int getStudentId() {        return studentId;    }
    public void setStudentId(int studentId) {        this.studentId = studentId;   }

    public String getName() {        return name;    }
    public void setName(String name) {        this.name = name;   }

    public int getPhoneNum() {        return phoneNum;    }
    public void setPhoneNum(int phoneNum) {        this.phoneNum = phoneNum;    }

    public String getJoinDate() {        return joinDate;    }
    public void setJoinDate(String joinDate) {        this.joinDate = joinDate;    }

    public static JsonObject studentRsToJson(SqlRowSet rs){
        return
        Json.createObjectBuilder()
            .add("studentId", rs.getInt("studentId"))
            .add("name", rs.getString("name"))
            .add("phoneNum", rs.getInt("phoneNum"))
            .add("joinDate", rs.getString("joinDate"))
            .build();
    }


}
