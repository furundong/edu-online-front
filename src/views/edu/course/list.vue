<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="searchObj.title" placeholder="课程标题"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="searchObj.status" clearable placeholder="发布状态">
          <el-option value="Normal" label="已发布"/>
          <el-option value="Draft" label="未发布"/>
        </el-select>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    <!-- 表格 -->
    <el-table
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="课程标题" width="200" />

      <el-table-column label="价格" width="100">
        <template slot-scope="scope">
          {{ scope.row.price===0?'免费':'收费' }}
        </template>
      </el-table-column>
      <el-table-column label="发布状态" width="100">
        <template slot-scope="scope">
          {{ scope.row.status==='Normal'?'已发布':'未发布' }}
        </template>
      </el-table-column>

      <el-table-column prop="lessonNum" label="总课时" width="100" />
      <el-table-column prop="viewCount" label="浏览数量" width="100" />

      <el-table-column prop="gmtCreate" label="添加时间" width="180"/>

      <el-table-column label="操作"align="center">
        <template slot-scope="scope">
          <router-link :to="'/edu/course/info/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination
      v-if="total > -1"
      :total="total"
      :page.sync="page"
      :limit.sync="limit"
      @pagination="fetchData"
    />
  </div>
</template>

<script>

  import Pagination from "@/components/Pagination";
  import course from '../../../api/edu/course'

  export default {
    name: "EduCourseList",
    components: {Pagination},
    props: [],
    data() {
      return {
        list: null, // 数据列表
        total: 0, // 总记录数
        page: 1, // 页码
        limit: 10, // 每页记录数
        searchObj:{},
      }
    },
    created() {
      this.fetchData();
    },
    methods: {
      fetchData() { // 调用api层获取数据库中的数据
        if(this.searchObj.title===''){
          this.searchObj.title = null;
        }
        if(this.searchObj.status===''){
          this.searchObj.status = null;
        }
        course.getPageList(this.page, this.limit,this.searchObj).then(response => {
          // debugger 设置断点调试
          if (response.success === true) {
            this.list = response.data.rows;
            this.total = response.data.total
          }
        })
      },
      removeDataById(id) {
        // debugger
        // console.log(memberId)
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return course.removeById(id)
        }).then(res => {
          this.fetchData()
          this.msg(res);
        }).catch((response) => { // 失败
          if (response === 'cancel') {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
        })
      },
      resetData() {
        this.searchObj = {}
        this.fetchData()
      }
    }
  }
</script>

<style scoped>

</style>
