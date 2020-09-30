<template>
  <div class="app-container">
    <el-form label-width="120px" :model="teacher" ref="teacher">
      <el-form-item label="讲师名称" prop="name">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序" prop="sort">
        <el-input-number v-model="teacher.sort" controls-position="right"/>
      </el-form-item>
      <el-form-item label="讲师头衔" prop="level">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历" prop="career">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介" prop="intro">
        <el-input v-model="teacher.intro" :rows="5" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">

        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
        </el-button>

        <!--
    v-show：是否显示上传组件
    :key：类似于id，如果一个页面多个图片上传控件，可以做区分
    :url：后台上传的url地址
    @close：关闭上传组件
    @crop-upload-success：上传成功后的回调 -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/admin/oss/file/upload'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>

      </el-form-item>


      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
        <el-button :disabled="saveBtnDisabled" type="warning" @click="resetForm('teacher')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import teacher from '@/api/edu/teacher'
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'

  const defaultForm = {
    name: '',
    sort: 0,
    level: '',
    career: '',
    intro: '',
    avatar: process.env.VUE_APP_OSS_URL + '/a.jpg'
  };
  export default {
    name: "formTeacher",
    components: {ImageCropper, PanThumb},
    props: [],
    data() {
      return {
        teacher: defaultForm,
        saveBtnDisabled: false, // 保存按钮是否禁用,
        BASE_API: process.env.VUE_APP_BASE_API, // 接口API地址
        imagecropperShow: false, // 是否显示上传组件
        imagecropperKey: 0, // 上传组件id
      }
    },
    watch: {
      $route(to, from) {
        this.init()
      }
    },
    created() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        this.fetchDataById(id)
      }
    },
    methods: {
      saveOrUpdate() {
        this.saveBtnDisabled = true
        if (!this.teacher.id) {
          this.saveData()
        } else {
          this.updateData()
        }
      },
      // 保存
      saveData() {
        this.saveBtnDisabled = true
        teacher.save(this.teacher).then(res => {
          if (res.success) {
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
        }).then(() => {
          this.$router.push({path: '/edu/teacher'})
        }).catch(e => {
          this.$message.error(e.message);
        })
      },
      fetchDataById(id) {
        teacher.getById(id).then(response => {
          this.teacher = response.data
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '获取数据失败'
          })
        })
      },
      // 根据id更新记录
      updateData() {
        this.saveBtnDisabled = true
        teacher.updateById(this.teacher).then(response => {
          return this.$message({
            type: 'success',
            message: '修改成功!'
          })
        }).then(resposne => {
          this.$router.push({path: '/edu/teacher'})
        }).catch((response) => {
          // console.log(response)
          this.$message({
            type: 'error',
            message: '保存失败'
          })
        })
      },
      init() {
        if (this.$route.params && this.$route.params.id) {
          const id = this.$route.params.id
          this.fetchDataById(id)
        } else {
          // 使用对象拓展运算符，拷贝对象，而不是引用，
          // 否则新增一条记录后，defaultForm就变成了之前新增的teacher的值
          this.teacher = {...defaultForm}
        }
      },
      // 上传成功后的回调函数
      cropSuccess(res) {
        if (res) {
          this.imagecropperShow = false
          this.teacher.avatar = res
          // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
          this.imagecropperKey = this.imagecropperKey + 1
          this.$message.success("上传成功")
        }
      },

      // 关闭上传组件
      close() {
        this.imagecropperShow = false
        // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
        this.imagecropperKey = this.imagecropperKey + 1
      },
      resetForm(formName) {
        this.$confirm('此操作将重置该操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$refs[formName].resetFields();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }
  }
</script>

<style scoped>

</style>
