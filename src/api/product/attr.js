/**
 * 属性相关的接口请求函数
 */
import request from '@/utils/request'

export default {
  // 根据三级分类获取平台属性
  getLIst(category1Id, category2Id, category3Id){
    return request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  },

  // 根据id删除某个平台属性
  delete(attrId){
    return request.delete(`/admin/product/deleteAttr/${attrId}`)
  },

  /**
   * 添加或者修改属性
   * attr类型
   * {
   *    "attrName": "String",
   *    "attrValueList": [
   *      {
   *        "attrId": 0,
   *        "id": 0,
   *        "valueName": "String"
   *      }
   *    ],
   *    "categoryId": 0,
   *    "categoryLevel": 0,
   *    "id": 0
   * }
   */ 

  addOrUpdata(attr){
    return request.post('/admin/product/saveAttrInfo', attr)
  }
}