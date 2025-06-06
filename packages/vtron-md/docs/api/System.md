# System


## constructor

```typescript

export interface WinAppOptions {
    name:string;
    icon?:string;
    window: {
        title: string
        content: BrowserWindowContent,
        config: any
        icon: string
        width: number
        height: number
        x: number
        y: number
        center: boolean
        resizable: boolean
        minimizable: boolean
        frame: boolean
        fullscreen: boolean
        alwaysOnTop: boolean
        skipTaskbar: boolean
        backgroundColor: string
    }
}
interface SystemOptions {
    id: number;
    /**
     * @description: 语言
     */
    lang?: string;
    /**
     * @description: logo
     */
    logo?: string;
    background?: string;
    rootStyle?: any;
    builtinFeature?: BuiltinFeature[];
    desktop?: WinAppOptions[];
    magnet?: WinAppOptions[];
    menulist?: WinAppOptions[];
    fs?: VtronFileInterface;
    userLocation?: string;
    systemLocation?: string;
    initFile?: InitFileItem;
    shell?: ShellInterface;
    brightness?: number;
    login?: {
        username: string;
        password: string;
        init?: () => boolean;
    };
    contextMenus?: Array<MenuItemConstructorOptions | MenuItem>;
    noPassword?: boolean;
    loginCallback?: (username: string, password: string) => Promise<boolean>;
    /**
     * 不立即挂载系统，默认为false
     */
    unMount?: boolean;
}

constructor(options?: SystemOptions)
```
## id

系统的id，用来区分当一个页面下有多个系统的时候

建议设置一个固定的id

## options-logo


logo：可以设置系统的 logo，如果不设置则使用默认的 logo

### Usage

```typescript
import { System } from 'vtron';
import vtronLogoIcon from './assets/vtron-icon-nobg.png';
import TestButton from './apps/TestButton.vue';
const system = new System({
  logo: vtronLogoIcon,
  background: 'https://source.unsplash.com/random/1920x1080',
  desktop: [
    {
      name: '测试按钮',
      icon: testicon,
      window: {
        content: TestButton,
        title: '测试按钮',
        icon: testicon,
        center: true,
      },
    },
  ],
});
```

## options-fs

可以设置文件系统，详见 api/fs

要实现自定义的 fs 系统，需要实现以下的接口

```typescript
export interface VtronFileInterface {
  readFile: (path: string) => Promise<string | null>;
  writeFile: (
    path: string,
    par: {
      content: string;
    }
  ) => Promise<void>;
  appendFile: (path: string, content: string) => Promise<void>;
  readdir: (path: string) => Promise<VtronFile[]>;
  exists: (path: string) => Promise<boolean>;
  stat: (path: string) => Promise<VtronFile | null>;
  unlink: (path: string) => Promise<void>;
  rename: (oldPath: string, newPath: string) => Promise<void>;
  rmdir: (path: string) => Promise<void>;
  mkdir: (path: string) => Promise<void>;
  serializeFileSystem: () => Promise<unknown>;
  deserializeFileSystem: (files: VtronFile[]) => Promise<unknown>;
  removeFileSystem: () => Promise<void>;
  registerWatcher: (path: RegExp, callback: (path: string, content: string) => void) => void;
}
class VtronFileInfo {
  isFile = true;
  isDirectory = false;
  isSymlink = false;
  size = 0;
  mtime: DateLike = new Date();
  atime: DateLike = new Date();
  birthtime: DateLike = new Date();
}
class VtronFile extends VtronFileInfo {
  path: string;
  parentPath: string;
  content: string;
  id?: number;
}
```

部分说明：

mtime atime birthtime 目前没有用到，可以不用管

registerWatcher 是用来监听文件变化的，path 是一个正则表达式，callback 是一个回调函数，当文件变化时，会调用这个回调函数

没有监听，在用户操作文件的时候，状态会不同步

removeFileSystem 是用来清除文件系统的，如果是例如接入了 Linux 的文件系统，可以不清除。

## options-shell

我们也把 shell 的能力抽象了出来，可以通过实现以下接口来实现自定义的 shell

```typescript
export interface ShellInterface {
  prefix: string;
  router: string;
  on: (event: 'message', callback: (...args: any[]) => void) => void;
  emit: (event: 'start', router: string, user: string) => void;
  exec: (input: string) => Promise<void>;
}
```

说明：prefix 是 shell 的前缀，

router 是 shell 的路由，

on 是监听事件，

emit 是触发事件，

exec 是执行命令

## whenReady

```typescript
whenReady(): Promise<System>
```

只有在系统准备之后，才能对 system 进行操作，如添加 app 到桌面

only after system ready, you can add app to desktop and so on

Usage:

```typescript
import { System } from 'vtron';
const system = new System();

system.whenReady().then((system) => {
  //...
});
```

## fs

是当前系统的文件系统，其中有一些方法可以用来操作文件系统

it is the file system of current system, there are some methods to operate file system

其他内容详见本文档的 api/fs 部分

see api/fs for more

### Usage

```typescript
import { system } from "./system";
system.fs.readFile('path/to/file').then((data) => {});
```

## shell

可以执行一段 shell 命令

可以执行的命令详见 api/shell

### Usage

```typescript
import { system } from "./system";
system.shell('cd C');
```

## emit

同 emitEvent

## emitEvent

在系统中提交一个事件

emit an event in system

系统中定义了一些内置的事件，可以提交事件来触发，例如打开右键菜单，详见本文档的 api/event 部分

there are some built-in events in system, you can emit event to trigger, for example, open context menu, see api/event for more

```typescript
import { system } from "./system";
system.emitEvent(event: string, ...args: any[])
```

## on

同 mountEvent

## mountEvent

在系统中监听一个事件

listen an event in system

系统中定义了一些内置的事件，可以监听事件来触发，例如打开右键菜单，详见本文档的 api/event 部分

there are some built-in events in system, you can listen event to trigger, for example, open context menu, see api/event for more

```typescript
import { system } from "./system";
system.mountEvent(event: string, callback: (...args: any[]) => void)
```

## registerFileOpener

注册一个文件打开器，当系统中有对应类型的文件被打开时，会调用这个打开器

register a file opener, when system open a file with this type, this opener will be called

其他内容详见本文档的 api/fs 部分

see api/fs for more

打开器的第一个参数是文件的扩展类型

```typescript
import { BrowserWindow } from "vtron";
import { system } from "./system";
system.registerFileOpener(".txt",{
    icon:mycomicon,
    func:(path,content)=>{
        let pdfwindow = new BrowserWindow({
            width: 400,
            height: 400,
            icon: mycomicon,
            center: true,
            title:'文本文档',
            content: TextViewer,
            config:{
                content:content,
                path:path
            }
        });
        pdfwindow.show()
    }
})
```

## openFile

打开一个文件，会调用对应类型的文件打开器

open a file, will call the opener with this type

其他内容详见本文档的 api/fs 部分

see api/fs for more

```typescript
import { system } from "./system";
system.openFile('path/to/file');
```

## use

为 system 添加一个插件，插件可以为 system 添加一些功能

add a plugin to system, plugin can add some features to system

vtron 提供了插件扩展能力，可以通过插件扩展系统的功能，当然，我们也开发了一些插件来提供一些基础的额外功能，vtron-plus 就是其中之一。

vtron provide plugin system, you can add some features to system by plugin, of course, we also develop some plugins to provide some basic features, vtron-plus is one of them.

关于 vtron-plus 的内容详见本文档的 vtron-plus 部分

see vtron-plus for more

```typescript
import { system } from "./system";
system.use(plugin: (system: System, rootState: RootState) => void)
```

## addApp

after system ready, add app to desktop

在系统准备完毕之后，添加 app 到桌面图标

注意，只有标记为第一次启动的系统，vtron 才会在桌面添加图标

所以，在开发时，需要点击开始菜单中的电源按钮，再点击恢复，才能看到 app

如果传入第二个参数为 true，则会强制添加 app 到桌面，但是这样会在每次打开页面的时候，都会添加 app 图标到桌面，即使已经删除了

```typescript
addApp(options: WinAppOptions, force = false)

export interface WinAppOptions {
  name: string;
  icon?: string;
  window: BrowserWindowOption;
}

```

Usage:

```typescript
import { System } from "vtron";
const system = new System();
system.whenReady().then((readySystem)=>{
    readySystem.addApp({
        name:"string";
        icon:"string";
        window{
          // ...
        }
    })
})
```

## addMagnet

add app to Magnet

添加 app 到磁贴

usage same as addApp

用法同 addApp

## addMenuList

add app to MenuList

添加 app 到菜单栏

usage same as addApp

用法同 addApp

## setAppOrder

设置 app 的顺序

```typescript
setAppOrder(loc: 'Desktop' | 'Magnet' | 'Menulist', orders: { name: string; order: number }[])


// 使用方法

  system.setAppOrder('Desktop', [
    {
      name: '此电脑',
      order: 4,
    },
    {
      name: '应用商店',
      order: 2,
    },
  ]);

```
order越大，越靠后


## shutdown

```typescript
shutdown();
```

关闭系统，屏幕会黑屏，只有刷新页面才能重新打开

shutdown system, screen will be black, you can only refresh page to open system again

Usage:

```typescript
import { System } from 'vtron';
const system = new System();

system.shutdown();
```

## reboot

重启系统，将系统关机，并且刷新页面

## recover

```typescript
recover();
```

恢复系统，恢复的过程是：清除本地的 localStorage，清楚本地的文件系统。

recover system, the process is: clear localStorage, clear file system.

恢复之后，系统会回到第一次启动的状态，这时，会执行一些特殊的过程，比如在桌面添加 app 图标

Usage:

```typescript
import { System } from 'vtron';
const system = new System();

system.recover();
```

## serializeState

序列化系统状态，将系统的文件系统保存为 json 字符串

之后可以通过反序列化来恢复系统状态

## deserializeState

反序列化系统状态，将系统的文件系统从 json 字符串中恢复

## createWindow

方便的通过system创建window

通过此方式创建的window，会指定创建到当前system中，这在一个网页中有多个system实例时，会很有用

```typescript
createWindow(options: BrowserWindowOption): BrowserWindow
```

有了这种方法，就不需要再引入BrowserWindow了

## createNotify

方便的通过system创建notify

通过此方式创建的notify，会指定创建到当前system中，这在一个网页中有多个system实例时，会很有用

```typescript
createNotify(options: NotifyOption): Notify
```

## createDialog

方便的通过system创建dialog

通过此方式创建的dialog，会指定创建到当前system中，这在一个网页中有多个system实例时，会很有用

```typescript
createDialog(): Dialog
```

## createTray

通过system创建Tray 

Tray是一个小图标，可以放在系统的托盘中

通过此方式创建的Tray，会指定创建到当前system中，这在一个网页中有多个system实例时，会很有用

```typescript
createTray(options: TrayOption): Tray
```