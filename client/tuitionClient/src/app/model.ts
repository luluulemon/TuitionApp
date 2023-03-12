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
    classDate: string
}


export interface Student{
    studentId: number
    name: string
    phoneNum: number
    joinDate: string
}

export interface Enrollment{
    studentId: number
    name: string
    phoneNum: number
    status: string
    expiryDate: string
    present: boolean
}