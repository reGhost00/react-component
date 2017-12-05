//验证码组件
import React from 'react';
import "../../css/ULTS/CPMT_CAPTCHA.css"
export default class extends React.Component{
	//属性
	//msg:		字符串	显示在滑动容器上的消息
	//active:	布尔		true 可用 false 不可用
	//cv_active:	函数		解锁时调用的函数
	constructor(props){
		super(props);
		this.state = {
			box:	null,	//滑动容器
			slider:	null,	//滑动块
			box_w:	0,		//滑动容器宽
			slider_w:	0	//滑动块宽
		};
		this.cbDragStart = this.cbDragStart.bind(this);	//开始拖动
		this.cbMove = this.cbMove.bind(this);	//拖动中
		this.cbDragEnd = this.cbDragEnd.bind(this);	//结束拖动
		this.cbOut = this.cbOut.bind(this);	//拖动时鼠标离开容器
	}
	componentDidMount(){
		let box = document.getElementById("CPMT_CAPTCHA"),
			slider = box.firstElementChild;//document.getElementById("cpmt_usct_captcha_slider");
		this.setState({
			box:	box,
			slider:	slider,
			box_w:	getComputedStyle(box).width,
			slider_w:	getComputedStyle(slider).width,
			slider_x:	box.clientLeft
		});
	}
	cbDragStart(ev){
		let box = this.state.box;
		box.addEventListener("mousemove", this.cbMove);
		box.addEventListener("mouseout", this.cbOut);
		this.setState({slider_x:ev.clientX - box.offsetLeft});
	}
	cbDragEnd(){
		this.state.box.removeEventListener("mousemove", this.cbMove);
		this.state.box.removeEventListener("mouseout", this.cbOut);
	}
	cbMove(ev){
		ev.preventDefault();
		let box = this.state.box,
			slider = this.state.slider;
		let bl = parseInt(box.offsetLeft) + parseInt(box.parentElement.offsetLeft),
			sl = ev.x - bl,
			sw = parseInt(parseInt(this.state.slider_w) / 2);
		if(sl + sw >= parseInt(this.state.box_w)){
			//解锁成功
			this.state.box.removeEventListener("mousemove", this.cbMove);
			this.state.box.removeEventListener("mouseout", this.cbOut);
			//传出事件
			if(typeof this.props.cv_active === "function")
				this.props.cv_active();
			else
				alert("解锁！");
		}
		else if(sl - sw > 0)
			slider.style.left = sl - sw + "px";
	}
	cbOut(){
		this.state.box.removeEventListener("mousemove", this.cbMove);
		this.state.box.removeEventListener("mouseout", this.cbOut);
	}
	render(){
		return <p id="CPMT_CAPTCHA">
			{this.props.msg}
			{(() => this.props.active ?
					<span className="slider anticon anticon-right" onMouseDown={this.cbDragStart} onMouseUp={this.cbDragEnd}></span> :
					<span className="block anticon anticon-close-circle"></span>
			)()}
		</p>
	}
}