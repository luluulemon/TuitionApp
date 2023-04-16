package vttp.course.tuition.server.models;

import org.springframework.jdbc.support.rowset.SqlRowSet;

import jakarta.json.Json;
import jakarta.json.JsonObject;

public class Schedule {
    
    private String className;
    private String classDate;

    public String getClassName() {        return className;    }
    public void setClassName(String className) {        this.className = className;    }

    public String getClassDate() {        return classDate;    }
    public void setClassDate(String classDate) {        this.classDate = classDate;    }

    public static JsonObject rsToSchedule(SqlRowSet rs){
        return Json.createObjectBuilder()
                    .add("teacherName", rs.getString("name"))
                    .add("className", rs.getString("className"))
                    .add("classDate", rs.getString("classDate"))
                    .build();
    }


}
