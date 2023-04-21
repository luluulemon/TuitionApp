package vttp.course.tuition.server.repositories;

public class Queries {
    
    public static String SQL_GET_PASSWORD = "select password from auth where email=?";

    public static String SQL_GET_TEACHERS = "select * from teachers";

    public static String SQL_GET_TEACHERID_FROM_NUM = "select teacherId from teachers where phoneNum=?";
    public static String SQL_ADD_CLASS = "insert into classes values(?, ?, ?, ?)";
    public static String SQL_GET_CLASSES = "select * from classes";
    public static String SQL_GET_UNIQUECLASSYEAR = "select distinct classYear from classes";

    public static String SQL_ADD_USER = "insert into auth values(?, ?, ?, ?, ?)";
    public static String SQL_ADD_TEACHER = "insert into teachers(name, phoneNum, joinDate) values(?, ?, ?)";
    public static String SQL_ADD_STUDENT = "insert into students(name, phoneNum, joinDate) values(?, ?, ?)";
    public static String SQL_UPDATE_USER_EMAIL = "update auth set email=? where phoneNum=?";
    public static String SQL_DELETE_USER = "delete from auth where phoneNum=?";
    public static String SQL_SEARCH_USER = "select * from auth where name like CONCAT(?,'%')";

    public static String SQL_ADD_SCHEDULE = "insert into schedules(classDate, className, classYear) values(?, ?, ?)";
    public static String SQL_GET_SCHEDULES = "select * from schedules where classYear=? and className=? order by classDate";
    public static String SQL_GET_RECENT_SCHEDULES = "select schedules.className, schedules.classDate, teachers.name  from schedules join classes on schedules.className=classes.className and schedules.classYear=classes.classYear join teachers on classes.teacherId=teachers.teacherId where classDate>? and classDate<? order by classDate";
    // select schedules.className, schedules.classDate, teachers.name  from schedules 
	//  join classes on schedules.className=classes.className and schedules.classYear=classes.classYear
    //  join teachers on classes.teacherId=teachers.teacherId
	//  where classDate>now() and classDate<'2023-04-20'
    //  order by classDate;
    public static String SQL_UPDATE_SCHEDULE = "update schedules set classDate=? where classYear=? and className=? and classDate=?";
    public static String SQL_UPDATE_SCHEDULE_W_ATTENDANCE = "update attendance set classDate=? where classYear=? and className=? and classDate=?";
    public static String SQL_DELETE_SCHEDULE = "delete from schedules where classYear=? and className=? and classDate=?";
    public static String SQL_DELETE_SCHEDULE_W_ATTENDANCE = "delete from attendance where classYear=? and className=? and classDate=?";

    public static String SQL_GET_STUDENTS = "select * from students";
    public static String SQL_SEARCH_STUDENTS = "select * from students where name like CONCAT(?,'%')";
    public static String SQL_UPDATE_STUDENT_PIC = "update students set profilePic=? where phoneNum=?";
    public static String SQL_UPDATE_STUDENT_NOTES = "update students set notes=? where phoneNum=?";
    public static String SQL_UPDATE_STUDENT_DETAILS = "update students set phoneNum=?, notes=? where phoneNum=?";

    public static String SQL_ADD_ENROLLMENT = "insert into enrollments values(?, ?, ?, ?, ?, ?)";
    public static String SQL_GET_EXISTING_ENROLLMENT = "select * from enrollments where phoneNum=? and className=? and expiryDate>=?";
    public static String SQL_GET_ENROLLMENT_BY_CLASS = 
        "select * from enrollments inner join students on enrollments.phoneNum = students.phoneNum where enrollments.classYear=? and enrollments.className=? and status!=?";
    public static String SQL_GET_ENROL_BY_STATUS = 
        "select * from enrollments where status='current' and expiryDate<now() OR status='pending' and startDate<now()";
    public static String SQL_UPDATE_STATUSSS = "update enrollments set status=? where phoneNum=?";
    public static String SQL_EXTEND_ENROLLMENT = "update enrollments set expiryDate=? where phoneNum=? and classYear=? and className=?";

    public static String SQL_ADD_ATTENDANCE = 
        "insert into attendance(classDate, className, phoneNum, classYear) values(?, ?, ?, ?)";
    public static String SQL_GET_ATTENDANCE =
        "select * from attendance where className=? and classDate=?";
    public static String SQL_GET_ATTENDANCE_FOR_CLASS=
        "select * from attendance where classYear=? and className=?";
    public static String SQL_UPDATE_ATTENDANCE_PHONENUM = "update attendance set phoneNum=? where phoneNum=?";

    public static String SQL_GET_STUDENT_DETAILS = "select students.studentId, students.name, students.phoneNum, students.joinDate, students.profilePic, students.notes, auth.email from students join auth on students.phoneNum = auth.phoneNum where students.phoneNum=?";
    public static String SQL_GET_STUDENT_ENROLMENTS = "select * from enrollments where phoneNum=?";
    public static String SQL_UPDATE_ENROLLMENT_PHONENUM ="update enrollments set phoneNum=? where phoneNum=?";
    

    public static String SQL_GET_CLASS_DETAILS =
        "select teachers.name from classes join teachers on classes.teacherId=teachers.teacherId where classYear=? and className=?";

        //"select teachers.name, count(schedules.classDate) as totalSessions, min(schedules.classDate) as startDate from classes join teachers on classes.teacherId=teachers.teacherId join schedules on classes.className=schedules.className where classes.className=? and schedules.classDate<now()";
    //select teachers.name, count(schedules.classDate) from classes join teachers on classes.teacherId=teachers.teacherId 
    // join schedules on classes.className=schedules.className
    // where classes.className=? and schedules.classDate<now();

}
