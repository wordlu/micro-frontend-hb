# micro frontend

这是一个微前端的整体架构，它的核心目标是最大程度的利用现有的已经完成的代码组件来实现开发分离。
实现代码重构，整体版本升级等一系列功能。解决现在前端出现的各种问题以及代码质量低下的问题。

代码的核心思想是利用装饰者模设计模式，在每一种框架间架设以Web Components为桥的装饰者
也就是将emberjs，reactjs，以及vuejs的组件重新编译成web component，然后在应用的过程中，
在将web component包装成各个框架的组件，最终利用JavaScript Events来来通信

# Web Components

## React

利用一个叫Direflow的库，可将React的component编译成web component。
基本上都帮你做好，可以将react里面的东西以event的形式传入到目标中，在利用react 的props来修改渲染。
简单直接。[Direflow][Direflow]

[Direflow]:https://direflow.io/

## Ember

emberjs是一个比较复杂的设计。

利用 [ember-cli-web-component][ember-cli-web-component] 将Ember的component编译成web component
ember的所有绘制全部基于[glimmerjs][glimmerjs]引擎
而且在绘制的过程中，会优先注册一个匿名的Controller，然后将这个controller做为消息传递以及props传递的核心。

我修改了开源库的代码，并将web component以及ember内部的匿名controller 做了一个双向引用。
传递的过程中，只能利用Controller，并对glimmerjs的hbs进行prop传递。并利用args中的element做消息推送。

匿名controller在element的context中。

最复杂，为了兼容以前的web components，不得不做这样的选择，其实不是最优解，一定会影响前端的渲染效率。

[ember-cli-web-components]:https://github.com/BBVAEngineering/ember-cli-web-components
[glimmerjs]:https://glimmerjs.com/

## Vue

> 不得不承认，像这样轻量级的View的设计，最好的就是Vue。

Vuejs 比较简单，但是在编译的过程中，发现Vue3对现有的web components还没有支持。
所以选用Vue2 作为web component的装饰者。

还是一样，在组件中可以直接通过$emit对外部发送event，并将event传递出来可以直接传递props改变绘制
其核心原理可以参考：[vue-web-component][vue-web-component]

[vue-web-component]: https://vuejsdevelopers.com/2018/05/21/vue-js-web-component/

# Web Shell

作为一个微前端的框架，是必须有一个共享区存放数据，当作整个前端的共享内存区。
虽然ember不适合作为component的选择，但是在整体数据缓存，数据观察以及数据监控上，以及service，adapter，serilzer的概念
它是一个非常合格的共享内存的解决方案。

由于[Ember][emberjs] 在 3.14版本后进行了相当大的升级，加强了效率和渲染速度，增加了大量的shortcut，可以让代码更加简洁。

我们的整体任务还是基于整体的emberjs把CI/CD以及Component合并在现有的牛逼的Shell中。

[emberjs]:https://emberjs.com/

# 运行启动

1. ember component 编译 把
2. Vue 编译
3. react编译
4. 把编译文件拷贝到pharbers-web的vender文件夹下

我已经给你们弄好了，你们不需要自己编译
除非你们已经学会了要不然请联系我。

