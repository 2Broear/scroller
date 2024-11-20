class slideBox {
    constructor() {
        this.elements = {
            slideCard: document.documentElement,
            slideBox: document.body,
        }
        this.data = {
            debugMode: false,
            slideAnimate: null,
            slideReverse: false,
            slideRestart: 1000,
            slideDirection: 1, //1,-1,0
            slideOffsetsX: 0,
            slideOffsetsY: 0,
            slideClass: 'sliding',
            slideSpeed: .25,
            slideWidth: 0,
            slideHeight: 0,
        }
        this.status = {
            // method
            isObject: (obj)=> Object.prototype.toString.call(obj)==='[object Object]',
            isElement: (node)=> node && node instanceof HTMLElement && node.nodeType === 1,
            isFunction: (func)=> func && typeof func === 'function',
            // static
            isScrollToAvailable: ()=> this.status.isFunction(this.elements.slideCard.scrollTo),
            isScrollAvailable: ()=> {
                const validSlideElements = this.status.isElement(this.elements.slideCard) && this.status.isElement(this.elements.slideBox);
                return validSlideElements && (this.data.slideDirection ? this.elements.slideCard.scrollHeight >= this.elements.slideCard.offsetHeight : this.elements.slideCard.scrollWidth >= this.elements.slideCard.offsetWidth); // use >= incase default elements(html,body) provided
            },
            // dynamic
            isScrollToStart: ()=> this.data.slideDirection ? this.data.slideOffsetsY <= 0 : this.data.slideOffsetsX <= 0,
            isScrollToEnd: ()=> this.data.slideDirection ? this.data.slideOffsetsY >= this.data.slideHeight : this.data.slideOffsetsX >= this.data.slideWidth,
        }
        this.mods = {
            randomNumber(from = 0, to = 1, fix = 2) {
                const random = (Math.random() * (to - from) + from);
                return parseFloat(random.toFixed(fix));
            },
            confRewriter: function _confRewriter(rewrite = {}, preset = {}, merge = true) {
                const result = { ...preset };
                for (const key in rewrite) {
                    if (rewrite.hasOwnProperty(key)) {
                        const validObjects = this.status.isObject(result[key]) && this.status.isObject(rewrite[key]); // const validObjects = Object.prototype.toString.call(result[key])==='[object Object]' && Object.prototype.toString.call(rewrite[key][key])==='[object Object]';
                        if (!merge) {
                            // 递归合并对象
                            result[key] = validObjects ? _confRewriter(rewrite[key], result[key] || {}, merge) : rewrite[key];
                            continue;
                        }
                        switch (true) {
                            // 合并数组
                            case Array.isArray(result[key]) && Array.isArray(rewrite[key]):
                                result[key] = [...new Set([...result[key], ...rewrite[key]])];
                                break;
                            // 覆盖元素
                            case this.status.isElement(rewrite[key]): // rewrite[key] instanceof HTMLElement
                                result[key] = rewrite[key];
                                break;
                            // 递归合并对象
                            default:
                                result[key] = validObjects ? _confRewriter(rewrite[key], result[key] || {}, merge) : rewrite[key];
                        }
                    }
                }
                return result;
            }
        }
    }
    
    abortAnimation (animateKey, callback, delay = 1) {
        cancelAnimationFrame(this.data.slideAnimate);
        if (this.status.isFunction(callback)) {
            if (!delay) {
                callback();
                return;
            }
            let timer = setTimeout(()=> {
                callback();
                clearTimeout(timer);
            }, this.data.slideRestart);
            console.log(`animation(${animateKey}) abort, restart in ${this.data.slideRestart} ms..`);
            return;
        }
        console.log(`animation(${animateKey}) stoped(without callback).`);
    }
    
    startAnimation () {
        // must clear animation frame(if animateKey exists) before startAnimation
        if (this.data.slideAnimate) cancelAnimationFrame(this.data.slideAnimate);
        // requestAnimationFrame 中的箭头函数会确保 this 指向 slideBox 实例，从而避免 undefined 的问题 //()=>this.startAnimation()
        this.data.slideAnimate = requestAnimationFrame(this.startAnimation.bind(this));
        if (this.data.slideReverse) {
            this.data.slideDirection ? this.data.slideOffsetsY -= this.data.slideSpeed : this.data.slideOffsetsX -= this.data.slideSpeed;
        } else {
            this.data.slideDirection ? this.data.slideOffsetsY += this.data.slideSpeed : this.data.slideOffsetsX += this.data.slideSpeed;
        }
        
        // animation start
        this.status.isScrollToAvailable ? this.elements.slideCard.scrollTo(this.data.slideOffsetsX, this.data.slideOffsetsY) : this.elements.slideBox.style.transform = `translate(-${this.data.slideOffsetsX}px, ${this.data.slideOffsetsY}px)`;
        
        // animation abort
        const isScrollToStart = this.status.isScrollToStart.call(this);
        const isScrollToEnd = this.status.isScrollToEnd.call(this);
        if (isScrollToStart || isScrollToEnd) {
            this.abortAnimation(this.data.slideAnimate, ()=> {
                // reverse only if isScrollToEnd
                this.data.slideReverse = isScrollToEnd;
                this.data.slideSpeed = this.mods.randomNumber(0.25);
                this.startAnimation();
            });
        }
        
        // animation debug
        if (this.data.debugMode) {
            if (this.data.slideWidth !== this.elements.slideCard.offsetWidth) console.warn('Wrong slideWidth detected!');
            if (this.data.slideHeight !== this.elements.slideCard.offsetHeight) console.warn('Wrong slideHeight detected!');
        }
    }
    
    initAnimation(_conf = {}) {
        // console.log(this.elements.slideCard.scrollWidth , this.elements.slideCard.offsetWidth, this.elements.slideCard)
        // rewrite custom arguments(data/elements only, before rewrite-elements)
        if (_conf.data) this.data = this.mods.confRewriter.call(this, _conf.data, this.data);
        if (_conf.elements) this.elements = this.mods.confRewriter.call(this, _conf.elements, this.elements);
        if (!this.status.isScrollAvailable()) {
            console.warn('invalid elements/scrollWidth/scrollHeight or slideDirection provided, check', this);
            return;
        }
        
        // update slideWidth/slideHeight after scrollWidth/scrollHeight updated.
        this.elements.slideCard.style.scrollBehavior = 'auto';
        this.elements.slideCard.classList.add(this.data.slideClass);
        this.data.slideWidth = this.elements.slideCard.scrollWidth - this.elements.slideCard.offsetWidth;
        this.data.slideHeight = this.elements.slideCard.scrollHeight - this.elements.slideCard.offsetHeight; 
        if (this.data.slideWidth === 0) this.data.slideWidth = this.elements.slideCard.scrollWidth;
        if (this.data.slideHeight === 0) this.data.slideHeight = this.elements.slideCard.scrollHeight;
        
        // update dynamic status to static(multi-call performance issue)
        this.status.isScrollToAvailable = this.status.isFunction(this.elements.slideCard.scrollTo);
        
        // start animation
        this.startAnimation();
        console.log('animation init.', this);
        
        // bind events
        const that = this;
        this.elements.slideCard.onpointerenter = ((interval = 200)=> {
            if (!that.data.slideAnimate) {
                console.log('non pointer exists.');
                return;
            };
            let debouncer = null;
            return function() {
                if(debouncer) clearTimeout(debouncer);
                debouncer = setTimeout(()=> {
                    // remember to 'bind' that-to-this points
                    that.abortAnimation(that.data.slideAnimate, that.startAnimation.bind(that));
                }, interval);
            }
        })(250);
    }
}

const slideBoxes = new slideBox();
// slideBoxes.data.slideSpeed = slideBoxes.mods.randomNumber(0.5);
slideBoxes.initAnimation({
    data: {
        slideSpeed: slideBoxes.mods.randomNumber(0.5),
        slideDirection: 0,
        // slideSpeed: 10,
        // debugMode: true,
    },
    elements: {
        slideCard: document.querySelector('.inboxSliderCard'),
        slideBox: document.querySelector('.slideBox'),
    }
});