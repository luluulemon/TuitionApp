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