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
}
