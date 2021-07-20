import request from '@/utils/request'

export default {
  // 每一个接口请求函数就是这个对象当中的一个方法
  // 获取分页列表
  getPageList(page, limit) {
    return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
  },

  // 删除BaseTradeMark
  delete(id){
    return request.delete(`/admin/product/baseTrademark/remove/${id}`)
  },

  // 添加或者删除品牌
  addOrUpdata(trademark){
    // 根据trademark对象中是否存在id进行添加或者更新操作，添加无需id，修改需要id
    if(trademark.id){
      return request.put('/admin/product/baseTrademark/updata', trademark)
    }else {
      return request.post('/admin/product/baseTrademark/save', trademark)
    }
  },

  /**
   * 获取所有品牌列表
   */
  getList(){
    return request.get('/admin/product/baseTrademark/getTrademarkList')
  }
}

/**
 * 不管是哪一种暴漏，最终都是一个对象
 */

/**
 * 默认暴漏，最终暴漏出去的是以default为属性，default后面的值为值的对象
 * 如：export default 100
 * 暴漏出去：{default: 100}
 * 引入方式：简写 import a from '../xxx.js'  a = 100
 * 完整写法：import {default as a} from '../xxx.js' default是关键字，所以要别名
 * 从这里可以看出，默认暴漏一定是一个对象，否则无解构，所以简化为简写写法
 *
 * export default {a: 1; b: 2} => 暴漏：{default: {a: 1; b: 2}}
 * 所以import {default as obj} from '../xxx.js' default就是{a: 1; b: 2}，关键字要别名
 * import {default as obj} from '../xxx.js' 等同于 import obj from '../xxx.js'
 */


/**
 * 部分暴漏，最终暴漏出去的是
 * export let a = 100
 * export const obj = {b: 1}
 * 暴漏出去也是一个对象，这个对象会自动添加{}，即{a:100; obj: {b:1}}
 * 因为import { a } from '../xx.js', { a } 就是在解构爆露出来的对象，解构名字与暴漏名字要相同
 */

/**
 * 整体暴露，最终暴漏出去的是
 * let a = 100
 * const obj = {b: 1}
 * export{
 *  a,
 * obj
 * }
 *
 * 整体暴漏出去的export后面是啥就是啥，也是对象
 * 引入方式同部分暴漏import { a } from '../xx.js'
 */

/**
 * 无论是那种暴漏，要获取到爆露出来的对象
 * import * as $API from '../xxxx.js'
 */