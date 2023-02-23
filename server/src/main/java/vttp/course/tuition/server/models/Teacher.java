package vttp.course.tuition.server.models;

import java.util.Date;

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


}
