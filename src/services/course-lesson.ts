/**
 * 课程课时相关请求模块
 */

import request from '@/utils/request'
import { AxiosPromise } from "axios";

type SaveOrUpdateLessonReq = {
  id:        number|string;
  courseId:  number;
  sectionId: number;
  theme:     string;
  duration:  number;
  isFree:    boolean;
  orderNum:  number;
  status:    number;
}

type LessonAPIRes<T> = {
  code: string;
  mesg: string;
  time: string;
  data: T;
}

export const createOrUpdateLesson = (data: SaveOrUpdateLessonReq):AxiosPromise<LessonAPIRes<any>> => {
  return request({
    method: 'POST',
    url: '/boss/course/lesson/saveOrUpdate',
    data
  })
}
