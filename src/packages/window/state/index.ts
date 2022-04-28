import { reactive, ref,shallowReactive } from "vue";
import { UnwrapNestedRefs } from "@vue/reactivity";
import type {windowInfoMapInter} from "@libs/DWM/type";
import type {Notify,appInfo} from "@state/type"
/*
 * @Author: zhangweiyuan-Royal
 * @LastEditTime: 2022-04-28 19:15:33
 * @Description: 全局的状态
 */

// export default reactive({
 
// });

let appList : UnwrapNestedRefs<Array<Required<appInfo>>>=shallowReactive([])
let windowInfoMap : UnwrapNestedRefs<windowInfoMapInter>={}// 所有窗口信息
let NotificationMap :  UnwrapNestedRefs<{ [key: string]: Notify }> ={}//提示信息

export {
  appList,
  windowInfoMap,
  NotificationMap
}