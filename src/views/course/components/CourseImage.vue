<template>
  <div class="course-image">
    <el-progress
      v-if="isUploading"
      type="circle"
      :percentage="percentage"
      :width="178"
      :status="percentage === 100 ? 'success' : undefined"
    />
    <el-upload
      v-else
      class="avatar-uploader"
      action="https://jsonplaceholder.typicode.com/posts/"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
      :http-request="handleUpload"
    >
      <img alt="avatar" v-if="value" :src="value" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, useContext } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadCourseImage, BaseCourseData } from '@/services/course'

const isUploading = ref(false)

const course: Ref<null | BaseCourseData> = ref(null)

const percentage = ref(0)

const useUpload = () => {
  const beforeAvatarUpload = (file: File, limit: number): boolean => {
    const isJPG = file.type === 'image/jpeg'

    const isLt2M = file.size / 1024 / 1024 < (limit|| 4)
    if (!isJPG) {
      ElMessage.error('上传头像图片只能为JPG格式!')
    }
    if (!isLt2M) {
      ElMessage.error('上传头像图片大小不能超过2MB!')
    }
    return isJPG && isLt2M
  }

  const { emit } = useContext()

  const handleUpload = async (options: any): Promise<any> => {
    try {
      isUploading.value = true
      const fd = new FormData()
      fd.append('file', options.file)
      const { data } = await uploadCourseImage(fd, e => {
        percentage.value = Math.floor(e.loaded / e.total * 100)
      })
      if (data.code === '000000') {
        isUploading.value = false

        // 不设置会有回退到0 的过渡动画 设置后瞬间清0
        percentage.value = 0
        emit('input', data.data.name)
      } else {
        ElMessage.error('上传失败')
      }
    } catch (err) {
      console.log(err)
    }
    isUploading.value = false
    percentage.value = 0
  }

  return {
    beforeAvatarUpload,
    handleUpload,
    isUploading,
    percentage
  }
}


export default defineComponent({
  name: 'CourseImage',
  props: {
    value: {
      type: String
    },
    limit: {
      type: Number,
      default: 2
    }
  },
  setup() {
    const { beforeAvatarUpload, handleUpload } = useUpload()

    return {
      course,
      percentage,
      beforeAvatarUpload,
      handleUpload,
      isUploading
    }
  }
})
</script>

<style lang="scss" scoped>
::v-deep(.avatar-uploader .el-upload) {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

::v-deep(.avatar-uploader .el-upload:hover) {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
