drop database if exists tuition;
create database tuition;

use tuition;

create table auth(
	phoneNum int not null,
    name varchar(64) not null,
    type enum('admin', 'teacher', 'student') not null,
    password varchar(24) not null,
    primary key(phoneNum)
);


create table teachers(
	teacherId int not null auto_increment,
    name varchar(64) not null,
    phoneNum int not null,
    joinDate date,
    primary key(teacherId),
    constraint fk_phoneNumTeacher foreign key(phoneNum) references auth(phoneNum) 
);


create table students(
	studentId int not null auto_increment,
    name varchar(64) not null,
    phoneNum int not null,
    joinDate date,
    primary key(studentId),
    constraint fk_phoneNumStudent foreign key(phoneNum) references auth(phoneNum) 
);


create table classes(
	class varchar(24) not null,
    description text,
    teacherId int not null,
    currentCount int not null,
    primary key(class),
    constraint fk_teacherId foreign key(teacherId) references teachers(teacherId) 
);


create table enrollments(
	phoneNum int not null,
    class varchar(24) not null,
    status enum('current', 'expired') not null,
    expiryDate date not null,
    constraint fk_phoneNum foreign key(phoneNum) references auth(phoneNum),
    constraint fk_class foreign key(class) references classes(class)
);


create table attendance(
	attendanceId int not null auto_increment,
    date date not null,
    class varchar(24) not null,
    phoneNum int not null,
    primary key(attendanceId),
    constraint fk_phoneNumAttendance foreign key(phoneNum) references auth(phoneNum)
);