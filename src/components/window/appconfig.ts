/*
 * @Author: zhangweiyuan-Royal
 * @LastEditTime: 2021-08-09 16:56:52
 * @Description: 
 * @FilePath: /myindex/src/components/window/appconfig.ts
 */
interface appInfo{
    name: string,
    apptemp: string,
    icon:string,
    width:number,
    height:number
}
let appList:Array<appInfo> = [
    {
        name: '我的电脑',
        apptemp: 'Test1',
        icon:'/computer.ico',
        width:400,
        height:400
    }, {
        name: '版本信息',
        apptemp: 'Test2',
        icon:'/beat.ico',
        width:100,
        height:100
    }, {
        name: '浏览器',
        apptemp: 'Test3',
        icon:'/浏览器.png',
        width:600,
        height:500
    },{
        name: '终端',
        apptemp: 'app_console',
        icon:'/term.ico',
        width:400,
        height:400
    },{
        name: 'vscode',
        apptemp: "app_vscode",
        icon:'/vscode.png',
        width:600,
        height:500
    }
]

export {appList,appInfo}