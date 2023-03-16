package vttp.course.tuition.server.repositories;

public class Queries {
    
    public static String SQL_GET_TEACHERS = "select * from teachers";

    public static String SQL_GET_TEACHERID_FROM_NUM = "select teacherId from teachers where phoneNum=?";
    public static String SQL_ADD_CLASS = "insert into classes values(?, ?, ?, ?)";
    public static String SQL_GET_CLASSES = "select * from classes";

    public static String SQL_ADD_USER = "insert into auth values(?, ?, ?, ?)";
    public static String SQL_ADD_TEACHER = "insert into teachers(name, phoneNum, joinDate) values(?, ?, ?)";
    public static String SQL_ADD_STUDENT = "insert into students(name, phoneNum, joinDate) values(?, ?, ?)";

    public static String SQL_ADD_SCHEDULE = "insert into schedules(classDate, className) values(?, ?)";
    public static String SQL_GET_SCHEDULES = "select * from schedules where className=?";

    public static String SQL_GET_STUDENTS = "select * from students";
    public static String SQL_SEARCH_STUDENTS = "select * from students where name like CONCAT(?,'%')";

    public static String SQL_ADD_ENROLLMENT = "insert into enrollments values(?, ?, ?, ?)";
    public static String SQL_GET_EXISTING_ENROLLMENT = "select * from enrollments where phoneNum=? and expiryDate>=?";
    public static String SQL_GET_ENROLLMENT_BY_CLASS = 
        "select * from enrollments inner join students on enrollments.phoneNum = students.phoneNum where enrollments.className=?";

    public static String SQL_ADD_ATTENDANCE = 
        "insert into attendance(date, className, phoneNum) values(?, ?, ?)";
    public static String SQL_GET_ATTENDANCE =
        "select * from attendance where className=? and date=?";
    
    public static String SQL_GET_CLASS_DETAILS =
        "select teachers.name, count(schedules.classDate) as totalSessions from classes join teachers on classes.teacherId=teachers.teacherId join schedules on classes.className=schedules.className where classes.className=? and schedules.classDate<now()";
    //select teachers.name, count(schedules.classDate) from classes join teachers on classes.teacherId=teachers.teacherId 
    // join schedules on classes.className=schedules.className
    // where classes.className=? and schedules.classDate<now();

}
