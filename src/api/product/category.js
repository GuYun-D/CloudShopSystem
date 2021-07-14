/**
 * 分类列表请求函数
 */
import request from '@/utils/request'

export default {
  // 一级列表请求
  getCategory1(){
    return request.get('/admin/product/getCategory1')
  },

  // 根据一级分类获取二级分类列表
  getCategory2(getCategory1Id){
    return request.get(`/admin/product/getCategory2${getCategory1Id}`)
  },

  // 根据二级分类获取三级分类列表
  getCategory3(getCategory2Id){
    return request.get(`/admin/product/getCategory3${getCategory2Id}`)
  }
}