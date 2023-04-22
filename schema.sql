drop database if exists tuition;
create database tuition;

use tuition;

create table auth(
	phoneNum int not null,
    name varchar(64) not null,
    type enum('admin', 'teacher', 'student') not null,
    email varchar(64) not null,
    password varchar(256) not null,
    primary key(phoneNum)
);


create table teachers(
	teacherId int not null auto_increment,
    name varchar(64) not null,
    phoneNum int not null,
    joinDate date,
    profilePic varchar(128),
    primary key(teacherId),
    constraint fk_phoneNumTeacher foreign key(phoneNum) references auth(phoneNum) 
);


create table students(
	studentId int not null auto_increment,
    name varchar(64) not null,
    phoneNum int not null,
    joinDate date,
    profilePic varchar(128),
    notes text,
    primary key(studentId),
    constraint fk_phoneNumStudent foreign key(phoneNum) references auth(phoneNum) 
);


create table classes(
	className varchar(24) not null,
    description text,
    teacherId int not null,
    classYear int not null,
    primary key(className, classYear),
    constraint fk_teacherId foreign key(teacherId) references teachers(teacherId) 
);


create table enrollments(
	phoneNum int not null,
    className varchar(24) not null,
    classYear int not null,
    status enum('pending', 'current', 'expired') not null,
    expiryDate date not null,
    startDate date not null,
    constraint fk_phoneNum foreign key(phoneNum) references auth(phoneNum),
    constraint fk_class foreign key(className, classYear) references classes(className, classYear)
);


create table attendance(
	attendanceId int not null auto_increment,
    classDate datetime not null,
    className varchar(24) not null,
    phoneNum int not null,
    classYear int not null,
    primary key(attendanceId),
    constraint fk_phoneNumAttendance foreign key(phoneNum) references auth(phoneNum)
);


create table schedules(
	classNumber int not null auto_increment,
	classDate datetime not null,
    className varchar(24) not null,
    classYear int not null,
    primary key(classNumber),
    constraint fk_className foreign key(className, classYear) references classes(className, classYear)
);

insert into auth values(69, 'admin', 'admin', 'admin@gmail.com' , 'admin')