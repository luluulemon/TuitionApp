package vttp.course.tuition.server.models;

public class Class {
    
    private String className;
    private int teacherId;
    private String description;
    private int currentCount;

    public String getClassName() {        return className;    }
    public void setClassName(String className) {        this.className = className;    }

    public int getTeacherId() {        return teacherId;    }
    public void setTeacherId(int teacherId) {        this.teacherId = teacherId;    }

    public String getDescription() {        return description;    }
    public void setDescription(String description) {        this.description = description;    }

    public int getCurrentCount() {        return currentCount;    }
    public void setCurrentCount(int currentCount) {        this.currentCount = currentCount;    }

    


}
