# scroller
a raw-scroll javascript slideBox plugin.

#### 功能简介

- 自定义滚动方向（水平、垂直、反向）
- 自定义滚动速度（可选随机碰撞速率）
- 自定义滚动次数（可选随机滚动次数）
- 自动/手动暂停动画（自动恢复）

![marker](https://raw.githubusercontent.com/2Broear/scroller/main/scroller.gif "scroller.gif")

## 使用说明
可 _手动_ 加载 `slidebox.js` 脚本后初始化，也可异步 `xhr` 加载完成初始化
```javascript
const slideBox = new AutoSlideBox();
slideBox.initAnimation();
```

示例：使用自带方法修改动画实例参数
```javascript
slideBox._config.get('slideSpeed');  //0.25
slideBox._config.set('slideSpeed', AutoSlideBox.BASIC.randomNumber(0.5));  //>=0.5
slideBox.abortAnimation(function() {
    // 手动暂停动画（可选回调）
}, 1000);  // 可选恢复动画延迟
slideBox.startAnimation(function() {
    // 手动恢复动画（可选回调）
});
```

示例：使用 `import` 完成初始化：
```javascript
<script type="module">
    try {
        import("/slidebox.js").then((res)=> {
            const { AutoSlideBox } = res;
            const slideBox = new AutoSlideBox();
            slideBox.initAnimation();
        }); 
    } catch(e) {}
</script>
```

### 初始化参数（可选）
初始化时，可携带部分对象参数以重载默认配置，常用配置项如下列表所示：

#### data-> 静态参数

| 参数 | 类型 | 描述 | 缺省 |
| :---- | :---- | :---- | :---- |
| slideAnimate | Any | 滚动动画 ID | `null` |
| slideReverse | Boolean | 反向滚动 | `false` |
| slideRestart | Number | 滚动恢复时间（毫秒） | `1000` |
| slideOffsetsX | Number | 滚动 X 轴偏移 | `0` |
| slideOffsetsY | Number | 滚动 Y 轴偏移 | `0` |
| slideDirection | Number | 滚动方向 | `1` |
| slideSpeed | Number | 滚动速率 | `.25` |
| slideWidth | Number | 滚动窗口宽度 | `0` |
| slideHeight | Number | 滚动窗口高度度 | `0` |
| slideRound | Number | 滚动次数 | `1` |
| slideClass | String | 滚动启动 class | `sliding` |
| slideRandom | Boolean | 随机滚动 | `false` |
| slideDebug | Boolean | 控制台调试信息 | `false` |
|  |  |  |  |
| slideFrame | HTMLElement | 滚动框架 | `document.documentElement` |
| slideBox | HTMLElement | 滚动窗口 | `document.body` |

#### 携带参数初始化（示例）

```javascript
// 自定义参数对象（常用）
const slideBox = new AutoSlideBox();
slideBox.initAnimation({
    slideSpeed: AutoSlideBox.BASIC.randomNumber(0.5),
    slideDirection: 1,
    slideElements: {
        slideFrame: document.querySelector('.inboxSliderCard'),
        slideBox: document.querySelector('.slideBox'),
    }
});
```

### todo

- ~~增强 `slideDirection` 多方向滚动（-1, 0, 1）~~

## 其他
任何问题及建议可提 issue.
