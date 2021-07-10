/**
 * 引入并暴漏，不能使用简写
 * 1.引入
 * 先把trademark引入到当前文件，再暴漏出去
 * 即：import {default as trademark} from './product/tradeMark'
 * 引入之后就拿到了
 * {
 *   getPageList(page, limit) {...},
 *   delete(id){...},
 *   addOrUpdata(trademark){...}
 * }
 * 然后把该对象赋值给tradeark
 * 2.暴漏,部分暴漏
 * export trademark
 * 3.就相当于是export trademark = {
 *    getPageList(page, limit) {...}
 *    delete(id){...},
 *    addOrUpdata(trademark){...}
 * }
 * 4.最后就相当于是使用部分暴漏了trademark，attr， spu，sku的api
 * 在引入的时候，此文件暴漏的就是{trademark, attr, spu, sku}
 */
export {default as trademark} from './product/tradeMark'

