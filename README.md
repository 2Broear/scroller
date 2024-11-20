# scroller
a raw-scroll javascript scroller plugin.

#### 功能简介

- 自定义滚动方向（水平、垂直、反向）
- 自定义滚动速度（可选随机碰撞速率）

![marker](https://raw.githubusercontent.com/2Broear/scroller/main/scroller.gif "scroller.gif")

## 使用说明
可 _手动_ 加载 `scroller.js` 脚本后初始化，也可异步 `xhr` 加载完成初始化：

```javascript
const slideBoxes = new slideBox();
// slideBoxes.data.slideSpeed = slideBoxes.mods.randomNumber();
slideBoxes.initAnimation();
```

### 初始化参数（可选）
初始化时，可携带部分对象参数以重载默认配置，常用配置项如下列表所示：

#### data-> 静态参数

| 参数 | 类型 | 描述 | 备注 |
| :---- | :---- | :---- | :---- |
| slideAnimate | Any | 滚动动画 ID | 默认 `null` |
| slideReverse | Boolean | 反向滚动 | 默认 `false` |
| slideRestart | Number | 滚动恢复时间（毫秒） | 默认 `1000` |
| slideOffsetsX | Number | 滚动 X 轴偏移 | 默认 `0` |
| slideOffsetsY | Number | 滚动 Y 轴偏移 | 默认 `0` |
| slideClass | String | 滚动启动 class | 默认 `sliding` |
| slideSpeed | Number | 滚动速率 | 默认 `.25` |
| slideWidth | Number | 滚动窗口宽度 | 默认 `0` |
| slideHeight | Number | 滚动窗口高度度 | 默认 `0` |
| slideDirection | Number | 滚动方向 | 默认 `1` |
|  |  |  |  |
| debugMode | Boolean | 滚动时控制台输出调试信息 | 默认 `false` |

#### element-> 元素参数
| 参数 | 类型 | 描述 | 备注 |
| :---- | :---- | :---- | :---- |
| slideCard | HTMLElement | 滚动框架 | 缺省 `document.documentElement` |
| slideBox | HTMLElement | 滚动窗口 | 缺省 `document.body` |

#### 携带参数初始化（示例）

```javascript
// 自定义参数对象（常用）
const slideBoxes = new slideBox();
const customArgs = {
    data: {
        slideSpeed: slideBoxes.mods.randomNumber(0.5),  // 随机（大于0.5）速率滚动
        slideDirection: 0, // 水平滚动
        debugMode: true,  // 调试模式
    },
    elements: {
        slideCard: document.querySelector('.inboxSliderCard'),  // inboxSliderCard 框架
        slideBox: document.querySelector('.slideBox'),  // slideBox 窗口
    }
}
// 初始化并重载自定义配置
slideBoxes.initAnimation(customArgs);
```

### todo

- 增强 `slideDirection` 多方向滚动（-1, 0, 1）

## 其他
任何问题及建议可提 issue.