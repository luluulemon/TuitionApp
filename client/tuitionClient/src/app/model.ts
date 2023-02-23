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