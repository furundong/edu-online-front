import request from '@/utils/request'

const api_name = '/edu/teacher'

export default {
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}`,
      method: 'get',
      params:{
        current:page,
        size:limit,
        ...searchObj
      }
    })
  },
  getList() {
    return request({
      url: `${api_name}/findAll`,
      method: 'get'
    })
  },
  removeById(teacherId) {
    return request({
      url: `${api_name}/${teacherId}`,
      method: 'delete'
    })
  },
  save(teacher) {
    return request({
      url: api_name,
      method: 'post',
      data: teacher
    })
  },
  getById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'get'
    })
  },
  updateById(teacher) {
    return request({
      url: `${api_name}`,
      method: 'put',
      data: teacher
    })
  }
}
