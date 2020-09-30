<template>
  <div class="app-container">
    <el-col :span="24">
      <el-card shadow="hover">
        <edit-table
          :tableData.sync="tableData"
          :opts.sync="opts"
          :showAddBtn="authority"
          :showBatchDelBtn="authority"
          height="565px"
          :total="total"
          :page="page"
          @saveData="save"
          @deleteRow="delRow"
          @delBatch="delBatch"
        >
        </edit-table>
      </el-card>
    </el-col>
  </div>
</template>

<script>
  import {getData} from '../../../api/edu/teacher'
  import editTable from '@/components/EditTable'

  export default {
    name: "list",
    components: {
      editTable
    },
    props: [],
    data() {
      return {
        tableData: [],
        /*
          :label="column.label"
          :prop="column.prop"
          :min-width="column.width"
          type:'' 如果不写则不更新
         */
        opts: [{
          label: '名字', prop: 'name', type: 'input', width: '40px'
        },
          {
            label: '头衔', prop: 'level', type: 'select', width: '60px', options: [{label: '高级讲师', value: 1}, {label: '首席讲师', value: 2}]
          }, {
            label: '资历', prop: 'intro', type: 'input', width: '150px', height: '60px'
          }, {
            label: '添加时间', prop: 'gmtCreate', type: 'date', format: 'yyyy-MM-dd HH:mm:ss', dateType: 'datetime'
          }, {
            label: '排序', prop: 'sort', type: 'input'
          },],
        //批量删除按钮
        objIds: [],
        batchBtn: true,
        //权限
        authority: true,
        //分页
        total: 0,
        page: {
          pageNum: 1,
          pageSize: 10,
        },
      }
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        const params = {
          ...this.page
        };
        getData(params).then(res => {
          if (res.success) {
            this.tableData = res.data;
            this.total = res.data.length
          }
        })
      },
      save(data, done) {
        //save
        if (data.id === undefined) {

        } else {
          //update
        }
      },
      delRow(id) {

      },
      delBatch(ids) {

      }
    }
  }
</script>

<style scoped>

</style>
