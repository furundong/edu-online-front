<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          @change="subjectLevelOneChanged"
          v-model="courseInfo.subjectParentId"
          placeholder="请选择">
          <el-option
            v-for="subject in subjectNestedList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="请选择">
          <el-option
            v-for="subject in subSubjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>


      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介 -->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>

      <!-- 课程封面-->
      <el-form-item label="课程封面">

        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/admin/oss/file/upload?host=cover'"
          class="avatar-uploader">
          <img :src="courseInfo.cover">
        </el-upload>

      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/>
        元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  import course from '@/api/edu/course'
  import subject from '@/api/edu/subject'
  import teacher from '@/api/edu/teacher'
  import Tinymce from '@/components/Tinymce'
  import {showLoading, hideLoading, destoryLoading} from '@/utils/loading'
  const defaultForm = {
    title: '',
    subjectParentId: '',
    subjectId: '',
    teacherId: '',
    lessonNum: 0,
    description: '',
    cover: process.env.VUE_APP_OSS_URL + '/cover/default.gif',
    price: 0,

  }
  export default {
    name: "EduCourseInfo",
    components: {Tinymce},
    props: [],
    data() {
      return {
        saveBtnDisabled: false, // 保存按钮是否禁用
        courseInfo: defaultForm,
        subjectNestedList: [],//一级分类列表
        subSubjectList: [],//二级分类列表
        teacherList: [], // 讲师列表
        BASE_API: process.env.VUE_APP_BASE_API ,// 接口API地址
        urlID:'',
      }
    },
    watch: {
      $route(to, from) {
        this.init()
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        if (this.$route.params && this.$route.params.id) {
          const id = this.$route.params.id
          this.urlID = id;
          //根据id获取课程基本信息
          this.fetchCourseInfoById(id);
        } else {
          this.courseInfo = {...defaultForm}
          // 初始化分类列表
          this.initSubjectList()
          // 获取讲师列表
          this.initTeacherList()
        }
      },
      fetchCourseInfoById(id) {
        course.getCourseInfoById(id).then(responseCourse => {
          this.courseInfo = responseCourse.data
          // 初始化分类列表
          subject.getNestedTreeList().then(responseSubject => {
            this.subjectNestedList = responseSubject.data
            for (let i = 0; i < this.subjectNestedList.length; i++) {
              if (this.subjectNestedList[i].id === this.courseInfo.subjectParentId) {
                this.subSubjectList = this.subjectNestedList[i].children
              }
            }
          })

          // 获取讲师列表
          this.initTeacherList()
        }).catch((response) => {
          this.$message({
            type: 'error',
            message: response.message
          })
        })
      },
      next() {
        this.saveBtnDisabled = true
        if (!this.courseInfo.id) {
          this.saveData()
        } else {
          this.updateData()
        }
      },
      // 保存
      saveData() {
        course.saveCourseInfo(this.courseInfo).then(response => {
          if (response.success)
            this.$message.success(response.message);
          else {
            this.$message.error(response.message);
          }
          return response// 将响应结果传递给then
        }).then(response => {
          this.$router.push({path: '/edu/course/chapter/' + response.data})
        }).catch((response) => {
          this.$message({
            type: 'error',
            message: response.message
          })
        })
      },
      updateData() {
        this.saveBtnDisabled = true
        course.updateCourseInfoById(this.courseInfo).then(response => {
          if (response.success)
            this.$message.success(response.message);
          else {
            this.$message.error(response.message);
          }
          return response// 将响应结果传递给then
        }).then(response => {
          this.$router.push({ path: '/edu/course/chapter/' + this.urlID})
        }).catch((response) => {
          // console.log(response)
          this.$message({
            type: 'error',
            message: '保存失败'
          })
        })
      },
      initSubjectList() {
        subject.getNestedTreeList().then(response => {
          this.subjectNestedList = response.data
        })
      },
      initTeacherList() {
        teacher.getList().then(response => {
          this.teacherList = response.data
        })
      },
      subjectLevelOneChanged(value) {
        for (let i = 0; i < this.subjectNestedList.length; i++) {
          if (this.subjectNestedList[i].id === value) {
            this.subSubjectList = this.subjectNestedList[i].children
            console.log(this.subSubjectList);
            this.courseInfo.subjectId = ''
          }
        }
      },
      handleAvatarSuccess(res, file) {
        console.log(res)// 上传响应
        console.log(URL.createObjectURL(file.raw))// base64编码
        hideLoading();
        this.courseInfo.cover = res.data
      },

      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        showLoading()
        return isJPG && isLt2M
      }
    }
  }
</script>

<style scoped>
  .tinymce-container {
    line-height: 29px;
  }
</style>
