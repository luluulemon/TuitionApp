export interface Teacher{
    name: string
    phoneNum: number
    teacherId: number
    joinDate: Date
}


export interface Class{
    className: string
    description: string
    teacherId: number
    classYear: number
    totalCount: number
}


export interface User{
    name: string
    phoneNum: number
    email: string
    type: string
}

export interface Schedule{
    className: string
    classYear: number
    classDate: string
}


export interface Student{
    studentId: number
    name: string
    phoneNum: number
    email: string
    joinDate: string
    profilePic: string
    notes: string
    enrollments: Enrollment[]
}

export interface Enrollment{
    studentId: number
    name: string
    className: string
    classYear: number
    phoneNum: number
    status: string
    expiryDate: string
    startDate: string
    present: boolean
}

export interface ClassDetail{
    teacherName: string
    totalSessions: number
    startDate: Date
}