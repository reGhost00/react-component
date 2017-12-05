//下拉选项框组件
import React, { Component } from 'react';

function isEmptyObject(obj){
	for(var key in obj)
		return false;
	return true;
}

export default class extends Component{
	//data		对象数组		下拉内容
	//	id		整数
	//	title	字符串	列表标题
	//	icon	字符串	列表项图标，将渲染为<i class="***"></i>
	//defaultTitle	字符串	默认显示标题
	//hover		布尔		是否移入触发弹出列表，不填或false点击触发
	//style		对象		组件样式
	//	container	字符串	容器样式
	//	title	字符串	选项框标题样式，包裹下拉箭头
	//	arrow	字符串	选项框下拉箭头样式
	//	list	字符串	选项框下拉列表样式
	//cvTitleClick()
	//cvMaskClick()
	//cvListClick()
	constructor(props){
		super(props);
		this.state = {
			active:false,
			selectedIdx:-1,
			selectedTitle:this.props.defaultTitle || "请选择",
			maskClass:"mask",
			listStyle:{}
		};
		this.cbTitleClick = this.cbTitleClick.bind(this);
		this.cbMaskClick = this.cbMaskClick.bind(this);
		this.cbListClick = this.cbListClick.bind(this);
		this.cbTitleEnter = this.cbTitleEnter.bind(this);
	}
	cbTitleEnter(e){
		let tar = e.target;
		if(tar.nodeName === "I")
			tar = tar.parentElement;
		if(tar.nodeName === "SPAN"){
			let rect = tar.getBoundingClientRect(),
				obj = {
						position:"absolute",
						top:rect.bottom,
						left:rect.left
					};
			if(JSON.stringify(this.state.listStyle)!==JSON.stringify(obj))
				this.setState({listStyle:obj});
		}
	}
	cbTitleClick(e){
		e.stopPropagation();
		if(this.state.maskClass === "mask active")
			this.setState({maskClass: "mask"});
		else
			this.setState({maskClass:"mask active"});
		if(typeof this.props.cvTitleClick === "function"){
			let tar = e.target;
			if(tar.nodeName === "i")
				tar = tar.parentElement;
			this.props.cvTitleClick(tar);
		}
	}
	cbMaskClick(e){
		e.stopPropagation();
		if(this.state.maskClass !== "mask")
			this.setState({maskClass : "mask"});
		if(typeof this.props.cvMaskClick === "function")
			this.props.cvMaskClick(e.target);
	}
	cbListClick(e){
		e.stopPropagation();
		let tar = e.target;
		if(tar.nodeName === "I")
			tar = tar.parentElement;
		if(tar.nodeName === "LI"){
			this.setState({
				maskClass:"mask",
				selectedTitle:this.props.data[tar.dataset.id].title
			});
			if(typeof this.props.cvListClick === "function")
				this.props.cvListClick(tar);
		}
	}
	render(){
		let data = this.props.data, style=this.props.style, items=[], cter="", title="", arrow="", list="", icon="";

		if(style && !isEmptyObject(style)){
			//容器样式
			cter = Object.prototype.toString.call(style.container);
			if(cter === "[object Array]")
				cter = style.container.join(" ");
			else if(cter === "[object String]")
				cter = style.container;
			else
				cter = "";
			//标题样式
			title = Object.prototype.toString.call(style.title);
			if(title === "[object Array]")
				title = style.title.join(" ");
			else if(title === "[object String]")
				title = style.title;
			else
				title = "";
			//下拉箭头样式
			arrow = Object.prototype.toString.call(style.arrow);
			if(arrow === "[object Array]")
				arrow = style.arrow.join(" ");
			else if(arrow === "[object String]")
				arrow = style.arrow;
			else
				arrow = "";
			//列表样式
			list = Object.prototype.toString.call(style.list);
			if(list === "[object Array]")
				list = style.list.join(" ");
			else if(list === "[object String]")
				list = style.list;
			else
				list = "";
		}

		if(Object.prototype.toString.call(data)==="[object Array]" && data.length>0){
			for(var i=0; i<data.length; i++){
				icon = Object.prototype.toString.call(data[i].icon);
				if(icon === "[object Array]")
					icon = data[i].icon.join(" ");
				else if(icon === "[object String]")
					icon = data[i].icon;
				else
					icon = "";

				items.push(<li key={data[i].id || i} data-id={data[i].id || i}>{icon && <i className={icon}></i>}{data[i].title}</li>);
			}
		}
		else
			items = <li className="noData">无数据</li>;

		return <div className={cter || null}>
			<span className={title || null} onClick={this.cbTitleClick} onMouseEnter={this.cbTitleEnter}>{this.state.selectedTitle}{arrow && <i className={arrow}></i>}</span>
			<div className={this.state.maskClass} onClick={this.cbMaskClick}>
				<ul className={list || null} style={this.state.listStyle} onClick={this.cbListClick}>
					{items}
				</ul>
			</div>
		</div>
	}
}
