/**
 * 课程相关请求模块
 */

import request from '@/utils/request'
import { AxiosPromise } from 'axios'

export const getQueryCourses = (data: {
  currentPage: number
  pageSize: number
  courseName: string
  status: string | number | null
}): AxiosPromise<CourseAPIRes<{
  records: Array<CourseData>
  total: number
  size: number
  current: number
  pages: number
}>> => {
  return request({
    method: 'POST',
    url: '/boss/course/getQueryCourses',
    data
  })
}

export const changeState = (params: {
  courseId: number | null | string
  status: string | number | null
}): AxiosPromise<ChangeStateRes> => {
  return request({
    method: 'GET',
    url: '/boss/course/changeState',
    params
  })
}

//:AxiosPromise<Exclude<CourseAPIRes<{}>,{time: string}>>

export interface CourseAPIRes<T> {
  code: string
  mesg: string
  time: string
  data: T
}

type ChangeStateRes = Omit<CourseAPIRes<any>, 'data'>

export interface SaveOrUpdateReq {
  id: number
  courseName: string
  brief: string
  teacherDTO: TeacherDTO
  courseDescriptionMarkDown: string
  price: number
  discounts: number
  priceTag: string
  discountsTag: string
  isNew: boolean
  isNewDes: string
  courseListImg: string
  courseImgUrl: string
  sortNum: number
  previewFirstField: string
  previewSecondField: string
  status: string | number
  sales: number
  activityCourse: boolean
  activityCourseDTO: ActivityCourseDTO
  autoOnlineTime: string
}

type SaveOrUpdateRes = CourseAPIRes<CourseData>

export type BaseCourseData = {
  id: number | string
  courseName: string
  brief: string
  courseDescription: string
  teacherId: number
  totalCourseTime: number
  sales: number
  actualSales: number
  price: number
  priceTag: string
  discounts: number
  discountsTag: string
  courseImgUrl: string
  shareTitle: string
  shareDescription: string
  shareImageTitle: string
  isNew: boolean
  isNewDes: string
  lastOperatorId: number
  createTime: string
  updateTime: string
  autoOnlineTime: string
  isDel: boolean
  totalDuration: number
  seoDescription: string
  seoKeywords: string
  seoTitle: string
  h5Url: string
  courseListImg: string
  tag: string
  status: string | number
  sortNum: number
  brokerageRate: number
  joinDistribution: boolean
  lastNoticeTime: string
  previewFirstField: string
  previewSecondField: string
  distributionPosterImage: string
  distributionCopywriter: string
  isGray: boolean
  sectionDTOS: SectionDTO[]
  teacherDTO: TeacherDTO
  courseUrl: string
  topNCourseLesson: TopNCourseLesson[]
  isBuy: boolean
  lessonUpdateCount: number
  compareTime: string
  lastLearnLessonName: string
  courseDescriptionMarkDown: string
  activityCourse: boolean
  activityTime: number
  activityCourseDTO: ActivityCourseDTO
  isStatusLoading?: boolean
}

export type CourseData = {
  [K in keyof BaseCourseData]: BaseCourseData[K] | null
}

export interface ActivityCourseDTO {
  id: number | string
  courseId: number
  beginTime: string
  endTime: string
  amount: number
  stock: number
}

export interface SectionDTO {
  id: number | string
  courseId: number
  sectionName: string
  description: string
  createTime: string
  updateTime: string
  isVisible: boolean
  isDe: boolean
  orderNum: number
  lastOperatorId: number
  status: string | number
  lessonDTOS: TopNCourseLesson[]
}

export interface TopNCourseLesson {
  id: number | string
  courseId: number
  sectionId: number
  theme: string
  duration: string
  durationNum: number
  isFree: boolean
  startImgUrl: string
  textContent: string
  markdownTextContent: string
  transcode: string
  resourceUrl: string
  lastOperatorId: number
  createTime: string
  updateTime: string
  isDel: boolean
  fileId: string
  orderNum: number
  aliFileUrl: string
  aliFileDk: string
  aliFileEdk: string
  aliFileVid: string
  status: string | number
  isTimingPublish: boolean
  publishTime: string
  mediaDTO: MediaDTO
}

export interface MediaDTO {
  id: number | string
  courseId: number
  sectionId: number
  lessonId: number
  channel: number
  mediaType: number
  coverImageUrl: string
  duration: string
  fileId: string
  fileUrl: string
  fileEdk: string
  fileSize: number
  fileName: string
  fileDk: string
  createTime: string
  updateTime: string
  status: number | string
  isDel: boolean
  lastOperatorId: number
  durationNum: number
}

export interface TeacherDTO {
  id: number | string
  courseId: number
  teacherName: string
  teacherHeadPicUrl: string
  position: string
  description: string
}

export const createOrUpdateCourse = (
  data: SaveOrUpdateReq
): AxiosPromise<SaveOrUpdateRes> => {
  return request({
    method: 'POST',
    url: '/boss/course/saveOrUpdateCourse',
    data
  })
}

type AnyObj = Record<string, any>

type UploadImgRes = CourseAPIRes<{
  uid: string
  name: string
  status: string | number
  response: null | string | AnyObj
}>

export const uploadCourseImage = (
  data: File | FormData,
  onUploadProgress: (progressEvent: ProgressEvent) => void
): AxiosPromise<UploadImgRes> => {
  // 该接口要求的请求数据类型是：multipart/form-data
  // 所以需要提交 FormData 数据对象
  return request({
    method: 'POST',
    url: '/boss/course/upload',
    data,
    // HTML5 新增的上传响应事件：progress
    onUploadProgress
  })
}

export type GetCourseData = {
  id: number
  courseName: string
  brief: string
  teacherDTO: TeacherDTO
  courseDescriptionMarkDown: string
  price: number
  discounts: number
  priceTag: string
  previewFirstField: string
  previewSecondField: string
  discountsTag: string
  courseListImg: string
  courseImgUrl: string
  sortNum: number
  status: number | string
  sales: number
  activityCourse: boolean
  activityCourseDTO: ActivityCourseDTO
}
type GetCourseRes = CourseAPIRes<GetCourseData>

export const getCourseById = (
  courseId: number | string
): AxiosPromise<GetCourseRes> => {
  return request({
    method: 'GET',
    url: '/boss/course/getCourseById',
    params: {
      courseId
    }
  })
}
