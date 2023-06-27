# vue-example-component
## Introduction
### 1. bp-select-vue
* Props
    - choosedValue: String; select的初始值
    - src: String; icon的src; 默认为null，在vue中需要使用require才能动态改变
### 2. bp-option-vue
* Props
    - text: String; option的显示值
    - choosedValue: String; 默认为空，如果需要选中高亮需要将该值赋值为select选中值的text
    - src: String; icon的src; 默认为null，在vue中需要使用require才能动态改变
* Event
    - click: 默认参数为该项的text

### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
### Compile to web component
```
npm run build:component
```