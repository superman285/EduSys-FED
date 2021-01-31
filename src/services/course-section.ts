/**
 * 课程章节相关请求模块
 */

import request from '@/utils/request'
import {TopNCourseLesson} from './course'
import { AxiosPromise } from "axios";

type Nullable<T> = {
  [K in keyof T]: T[K] | null
}

type LessonDTO = Nullable<TopNCourseLesson>

type SectionData = {
  id:             number | string;
  courseId:       number;
  sectionName:    string;
  description:    string;
  createTime:     string;
  updateTime:     string;
  isVisible:      boolean | null;
  isDe:           boolean;
  orderNum:       number;
  lastOperatorId: number | null;
  status:         number;
  lessonDTOS:     LessonDTO[] | null;
}

type GetSectionRes = {
  code: string;
  mesg: string;
  time: string;
  data: SectionData[];
}

type SaveOrUpdateSectionReq = {
  id:          number | string;
  courseId:    number;
  courseName:  string;
  sectionName: string;
  description: string;
  orderNum:    number;
  status:      number;
}

type SectionAPIRes<T> = {
  code: string;
  mesg: string;
  time: string;
  data: T;
}

export const getSectionAndLesson = (courseId: string | number):AxiosPromise<GetSectionRes> => {
  return request({
    method: 'GET',
    url: '/boss/course/section/getSectionAndLesson',
    params: {
      courseId
    }
  })
}

export const createOrUpdateSection = (data: SaveOrUpdateSectionReq):AxiosPromise<SectionAPIRes<any>> => {
  return request({
    method: 'POST',
    url: '/boss/course/section/saveOrUpdateSection',
    data
  })
}

export const getSectionById = (sectionId: string | number):AxiosPromise<SectionData> => {
  return request({
    method: 'GET',
    url: '/boss/course/section/getBySectionId',
    params: {
      sectionId
    }
  })
}
