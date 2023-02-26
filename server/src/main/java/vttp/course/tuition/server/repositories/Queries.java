package vttp.course.tuition.server.repositories;

public class Queries {
    
    public static String SQL_GET_TEACHERS = "select * from teachers";

    public static String SQL_GET_TEACHERID_FROM_NUM = "select teacherId from teachers where phoneNum=?";
    public static String SQL_ADD_CLASS = "insert into classes values(?, ?, ?, ?)";
    public static String SQL_GET_CLASSES = "select * from classes";
}
