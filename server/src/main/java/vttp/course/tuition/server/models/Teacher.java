package vttp.course.tuition.server.models;

import java.util.Date;

import org.springframework.jdbc.support.rowset.SqlRowSet;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import vttp.course.tuition.server.services.util;

public class Teacher {
    
    private String name;
    private int teacherId;
    private int phoneNum;
    private Date joinDate;

    public String getName() {        return name;    }
    public void setName(String name) {        this.name = name;    }

    public int getTeacherId() {        return teacherId;    }
    public void setTeacherId(int teacherId) {        this.teacherId = teacherId;    }

    public int getPhoneNum() {        return phoneNum;    }
    public void setPhoneNum(int phoneNum) {        this.phoneNum = phoneNum;    }

    public Date getJoinDate() {        return joinDate;    }
    public void setJoinDate(Date joinDate) {        this.joinDate = joinDate;    }

    public static JsonObject rsToJsonWithClasses(SqlRowSet teacherRs, JsonArray classes){
        return Json.createObjectBuilder()
                    .add("name", teacherRs.getString("name"))
                    .add("studentId", teacherRs.getInt("teacherId"))
                    .add("profilePic", util.defaultValue(teacherRs.getString("profilePic"), "NA") )
                    .add("phoneNum", teacherRs.getInt("phoneNum"))
                    .add("email", teacherRs.getString("email"))
                    .add("joinDate", teacherRs.getString("joinDate"))
                    .add("classes", classes)
                    .build();
    }
}
