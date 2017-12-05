//列表组件
import React, { Component } from 'react';
import CPMT_select from "./cpmt_select";

function get_max(arr){
	//获取字符串数组arr中最长字符数
	let max =0;
	for(var i=0; i<arr.length; i++)
		if(arr[i] > max)
			max = arr[i];
	return max;
}

function set_width(){
	let nodes=[], width=[], cols=this.props.cols, tmp=[];
	for(var c=0; c<cols.length; c++){
		nodes = this.list.querySelectorAll(`span:nth-child(${c+1})`);
		for(var i=0; i<nodes.length; i++)
			nodes[i].dataset.name && tmp.push(parseInt(getComputedStyle(nodes[i]).width));
		width.push(get_max(tmp));
		tmp=[];
	}
	this.setState({colWidth:width});
}

function isEmptyObject(obj){
	for(var key in obj)
		return false;
	return true;
}
const style_inline_block = {
	display : "inline-block"
};

class CPMT_tree_view_header extends Component{
	//列表头
	//data		对象数组		父组件的cols属性
	//width		最小列宽
	//cvClick()
	constructor(props){
		super(props);
		this.cbClick = this.cbClick.bind(this);
	}
	cbClick(e){
		e.stopPropagation();
		if (typeof this.props.cvClick === "function")
			this.props.cvClick(e.target);
	}
	render(){
		let arr=this.props.data ,style=this.props.style ,cols=[] ,i=0;
		if(this.props.width.length>0)
			for(; i<arr.length; i++)
				cols.push(<span style={{display:"inline-block",minWidth:this.props.width[i]}} key={arr[i].name} data-name={arr[i].name} data-idx={i}>{arr[i].title}</span>);
		else
			for(; i<arr.length; i++)
				cols.push(<span style={style_inline_block} key={arr[i].name} data-name={arr[i].name} data-idx={i}>{arr[i].title}</span>);
		if(style && !isEmptyObject(style)){
			let str = Object.prototype.toString.call(style);
			if(str === "[object Array]")
				style = style.join(" ");
			else if(str !== "[object String]")
				style = "";
		}
		else
			style = "";
		return <header className={style || null} onClick={this.cbClick}>
			{cols}
		</header>
	}
}

class CPMT_tree_view_footer extends Component{
	//列表脚		提供翻页，控制每页显示行数，页跳转
	//allRows	整数		记录总数
	//pageRows	整数		每页显示记录数
	//nowPage   整数		当前页
	//style     对象		样式设置
	//	container	字符串	容器样式
	//	select	对象		下拉列表样式
	//	input	字符串	输入框样式
	//	button	字符串	按钮样式
	//cvPrev()
	//cvNext()
	//cvTo()	事件	跳转到某页面
	//cvPageRowsChange()	事件	最大显示行改变
	constructor(props){
		super(props);
		this.state = {
			toPage:1,
			nowPage:1,
			rowList:[],
			pages: this.props.pageRows >1 ? Math.ceil(this.props.allRows / this.props.pageRows) : 1
		};
		this.cbPrevClick = this.cbPrevClick.bind(this);
		this.cbNextClick = this.cbNextClick.bind(this);
		this.cbPageChange = this.cbPageChange.bind(this);
		this.cbPageRowsChange = this.cbPageRowsChange.bind(this);
		this.cbJumpToPage = this.cbJumpToPage.bind(this);
	}
	componentWillReceiveProps(props){
		if(this.props.pageRows >1){
			let r, obj = {
				rowList:[],
				pages: Math.ceil(props.allRows / props.pageRows),    //总行数 / 每页行数
				nowPage: parseInt(props.nowPage) || 1   //当前页
			};
			if(obj.nowPage > obj.pages)     //如果当前页 > 总页数
				obj.nowPage = obj.pages;    //当前页 = 最后一页
			if(this.state.toPage > obj.pages)
				obj.toPage = 1;
			r=this.props.pageRows-6;  //每页显示数据
			if(r<1){
				r = this.props.pageRows-3;
				if(r<1)
					r = this.props.pageRows;
			}
			for(var i=0; i<5; i++)
				obj.rowList.push({id:i, title:r+i*3});

			this.setState(obj); //此处设置仅影响当前组件，不影响列表
		}
		else
			this.setState({
				pages: 1,
				nowPage: 1,
				rowList:[{id:1, title:"所有"}]
			});
	}
	cbPrevClick(){
		if(typeof this.props.cvPrev === "function")
			this.props.cvPrev();
	}
	cbNextClick(){
		if(typeof this.props.cvNext === "function")
			this.props.cvNext();
	}
	cbPageChange(e){
		let to = parseInt(e.target.value);
		if (to>0 && to <= this.state.pages)
			this.setState({toPage: to});
	}
	cbPageRowsChange(tar){
		if(typeof this.props.cvPageRowsChange === "function")
			this.props.cvPageRowsChange(parseInt(tar.innerHTML));
	}
	cbJumpToPage(){
		if(typeof this.props.cvTo === "function")
			this.props.cvTo(this.state.toPage);
	}
	render(){
		let style = this.props.style,
			str = Object.prototype.toString.call(style.container),
			button = Object.prototype.toString.call(style.button),
			input = Object.prototype.toString.call(style.input);
		if(style && !isEmptyObject(style)){
			// 容器样式
			if(str === "[object Array]")
				str = style.container.join(" ");
			else if(str === "[object String]")
				str = style.container;
			else
				str = "";
			// 按钮样式
			if(button === "[object Array]")
				button = style.button.join(" ");
			else if(button === "[object String]")
				button = style.button;
			else
				button = "";
			// 输入框样式
			if(input === "[object Array]")
				input = style.input.join(" ");
			else if(input === "[object String]")
				input = style.input;
			else
				input = "";
		}
		else{
			str = "";
			button = "";
			input = "";
		}

		return <footer className={str || null}>
			<span>每页显示<CPMT_select data={this.state.rowList} defaultTitle={this.state.rowList.length>0? this.state.rowList[0].title : "所有"} style={style.select} cvListClick={this.cbPageRowsChange}/>条数据，共{this.props.allRows}条</span>
			<span className={button || null} title="上一页" onClick={this.cbPrevClick}>&lt;</span>
			<span title="当前页">{this.state.nowPage}</span>
			<span className={button || null} title="下一页" onClick={this.cbNextClick}>&gt;</span>
			<span>共{this.state.pages}页，到<input className={input || null} title={`仅允许输入1~${this.state.pages}之间的整数`} value={this.state.toPage} onChange={this.cbPageChange}/>页</span>
			<span className={button || null} onClick={this.cbJumpToPage}>跳转</span>
		</footer>
	}
}

function get_cpmt_list_col(props, title, idx, include) {
	//列表行列包装
	//style		列内联样式
	//key		react列表key
	//title		显示标题
	return <span {...props} data-name={props.key} data-idx={idx}>{include}{title}</span>
}

class CPMT_tree_view_item extends React.Component{
	//列内容
	//cols		对象数组	父组件的cols属性
	//data		对象		父组件的rows提取对象
	//children	对象数组	二级列表
	//childCols	对象数组	二级列表cols属性
	//width		最小列宽	自适应列宽用，不公开
	//style		对象		样式
	//	container	字符串	容器样式
	//	check	字符串	checkbox样式
	//	sub		字符串	二级列表样式
	//fatherId		父节点id，二级节点用
	//ifCheck		布尔		允许选中
	//ifMultiple	布尔		允许多选
	//cvClick()    单击事件    参数：rowid  tar  checked
	constructor(props){
		super(props);
		this.state = {
			spread:false,
			check:false
		};
		this.cbClick = this.cbClick.bind(this);
	}
	cbClick(e){
		let tar = e.target, obj = {};
		e.stopPropagation();
		if(tar.nodeName === "INPUT")
			tar = tar.parentElement;
		if(tar.nodeName === "SPAN"){
			if(parseInt(tar.parentElement.dataset.spread) >0)
				obj.spread = !this.state.spread;

			if(this.props.ifCheck)
				obj.check = !this.state.check;

			if(!isEmptyObject(obj))
				this.setState(obj);

			if (typeof this.props.cvClick === "function")
				this.props.cvClick(tar);
		}
	}
	render(){
		let header=this.props.cols,
			data=this.props.data,
			style=this.props.style,
			cols=[],spread=[], haveStyle=false, i=0, str="";

		if(this.props.ifCheck){
			if(style && !isEmptyObject(style)){
				//检查checkbox样式
				str = Object.prototype.toString.call(style.check);
				if(str === "[object Array]")
					str = style.check.join(" ");
				else if(str === "[object String]")
					str = style.check;
				else
					str = "";
			}
			cols.push(get_cpmt_list_col({
				style:this.props.width.length >0 ? {
					display:"inline-block",
					minWidth:this.props.width[i]
				} : style_inline_block,
				key:header[i].name
			}, data[header[i].name], i, <input type="checkbox" className={str || null} checked={this.state.check}/>));
			i=1;
		}
		for(; i<header.length; i++)
			cols.push(get_cpmt_list_col({
				style:this.props.width.length >0 ? {
					display:"inline-block",
					minWidth:this.props.width[i]
				} : style_inline_block,
				key:header[i].name
			}, data[header[i].name], i));

		if(typeof this.props.children === "string" && Object.prototype.toString.call(data[this.props.children]) === "[object Array]" && data[this.props.children].length >0 ){
			let children = data[this.props.children];
			for(i=0; i<children.length; i++)//遍历所有行
				spread.push(<CPMT_tree_view_item key={children[i].id} fatherId={data.id} data={children[i]} style={style} cols={this.props.childCols || header} width={this.props.width} ifCheck={this.props.ifCheck} ifMultiple={this.props.ifMultiple} cvClick={this.props.cvClick}/>)
		}
		//设置样式

		if(style && !isEmptyObject(style)){
			str = Object.prototype.toString.call(style.container);
			if(str === "[object Array]")
				str = style.container.join(" ");
			else if(str === "[object String]")
				str = style.container;
			else
				str = "";
			haveStyle = true;
		}
		else
			str = "";
		if(this.props.ifCheck && this.state.check)
			str.length >0 ? str += " active" : str = "active";

		if(this.state.spread)
			str.length >0 ? str += " spread" : str = "spread";

		return <div className={str || null} data-id={data.id} data-father={isNaN(this.props.fatherId) ? null : this.props.fatherId} data-spread={spread.length >0 ? spread.length : null} onClick={this.cbClick} >
			{cols}
			{(()=>{
				//判断是否有定义props.style.sub，如有，创建容器包裹
				if(spread.length >0){
					let sub="" ;//= this.props.style;
					if(haveStyle){
						sub = Object.prototype.toString.call(style.sub);
						if(sub === "[object Array]")
							sub = style.sub.join(" ");
						else if(sub === "[object String]")
							sub = style.sub;
						else
							sub = "";
					}
					if(sub.length >0)
						return <div className={sub || null}>
							{spread}
						</div>;
					else
						return spread;
				}
			})()}
		</div>
	}
}

export default class extends Component{
	//cols	对象数组		列属性
	//	title	列标题
	//	name	字段名
	//	type	列类型
	//data	对象数组		行内容
	//	id:必须
	//	字段名:字段内容
	//maxRow    最大显示行
	//check		布尔		允许选中
	//multiple	布尔		允许多选
	//footer	布尔		显示列表脚
	//style		对象		列表样式
	//	container	数组或字符串	容器样式
	//	header		数组或字符串	列表头样式
	//	list		数组或字符串	列表主体样式，如提供，创建列表主体容器包裹每列
	//	item		对象		列表行样式
	//		container	数组或字符串	列表行样式
	//		sub		数组或字符串	二级列表容器样式
	//	footer	对象		列表脚样式
	//		container	数组或字符串	列表脚样式
	//		input	数组或字符串	列表脚跳转输入框
	//      button	数组或字符串	列表脚按钮样式
	//		select	对象		列表脚最大行下拉样式
	//cvRowClick()    单击事件    参数：tar  father
	//cvHeaderClick() 单击事件    参数：tar
	constructor(props){
		super(props);
		this.state = {
			colWidth: [],//列宽
			maxRow:this.props.maxRow >0 ? parseInt(this.props.maxRow) : 0 ,   //显示最大行数
			page:1  //当前页
		};
		this.cbRowClick = this.cbRowClick.bind(this);
		this.cbHeaderClick = this.cbHeaderClick.bind(this);
		this.cbFooterPrev = this.cbFooterPrev.bind(this);
		this.cbFooterNext = this.cbFooterNext.bind(this);
		this.cbFooterMaxRowChange = this.cbFooterMaxRowChange.bind(this);
		this.cbFooterToPage = this.cbFooterToPage.bind(this);
		setTimeout(set_width.bind(this), 211);
	}
	componentWillReceiveProps(props){
		if(JSON.stringify(this.props)!==JSON.stringify(props)){
			let obj={page:1};
			if(props.maxRow >1){
				obj.maxRow = parseInt(props.maxRow);
				obj.page = Math.ceil(props.data.length / obj.maxRow); //总行数 / 每页行数 = 总页数
			}
			this.setState(obj);
			setTimeout(set_width.bind(this), 211);
		}
	}
	cbRowClick(tar){
		//列表项单击
		if (typeof this.props.cvRowClick === "function")
			this.props.cvRowClick(tar, tar.parentElement);
	}
	cbHeaderClick(tar){
		//列表头单击
		if (typeof this.props.cvHeaderClick === "function")
			this.props.cvHeaderClick(tar);
	}
	cbFooterPrev(){
		if(this.state.maxRow > 1 && this.state.page>1)//如果是分页
			this.setState({page:this.state.page -1});
	}
	cbFooterNext(){
		if(this.state.maxRow > 1 ){ //如果是分页
			let len=this.props.data.length;    //取列表长度
			if(this.state.page * this.state.maxRow < len){//当前页数*每页行数=当前行数
				this.setState({page:this.state.page +1});
				setTimeout(set_width.bind(this, false), 211);
			}
		}
	}
	cbFooterMaxRowChange(row){
		if(row>1){
			let obj = {maxRow: row}, pages = Math.ceil(this.props.data.length / row);//总行数 / 每页行数 = 总页数
			if(this.state.page > pages) //如果当前页大于总页数
				obj.page = pages;
			this.setState(obj);
		}
	}
	cbFooterToPage(page){
		this.setState({page:page});
	}
	render(){
		let data=this.props.data, cols=this.props.cols, style=this.props.style, haveStyle=false, str="";
		//data:行内容  cols:列属性
		if(!style || isEmptyObject(style))
			style = {};
		else
			haveStyle = true;
		if(Object.prototype.toString.call(data)==="[object Array]" && data.length>0 && Object.prototype.toString.call(cols)==="[object Array]" && cols.length>0){
			let page=this.state.page, arr=[], i=0, from=0, to=0, maxRow=this.state.maxRow;
			if(maxRow>1){      //分页显示
				if(page>0)  //要显示的页码
					from = (page-1)*maxRow;    //计算出对应开始行
				to = from + maxRow;    //结束行
				if(to > data.length)    //如果已到最后一页
					to = data.length;
			}
			else
				to = data.length;
			for(i=from; i<to; i++)    //生成列
				arr.push(<CPMT_tree_view_item key={data[i].id} cols={cols} data={data[i]} style={style.item} children="list" width={this.state.colWidth} ifCheck={this.props.check} ifMultiple={this.props.multiple}  cvClick={this.cbRowClick}/>);

			if(haveStyle){
				str = Object.prototype.toString.call(style.container);
				if(str === "[object Array]")
					str = style.container.join(" ");
				else if(str === "[object String]")
					str = style.container;
				else
					str = "";
			}

			return <div className={str || null} ref={list => this.list = list}>
				<CPMT_tree_view_header data={cols} width={this.state.colWidth} style={style.header} cvClick={this.cbHeaderClick}/>
				{(()=>{
					//判断是否有定义props.style.list，如有，创建容器包裹
					if(haveStyle){
						str = Object.prototype.toString.call(style.list);
						if(str === "[object Array]")
							str = style.list.join(" ");
						else if(str === "[object String]")
							str = style.list;
						else
							str = "";
						return <div className={str || null}>{arr}</div>;
					}
					else
						return arr;
				})()}
				{this.props.footer && <CPMT_tree_view_footer style={style.footer} allRows={data.length} pageRows={maxRow} nowPage={page} cvPrev={this.cbFooterPrev} cvNext={this.cbFooterNext} cvPageRowsChange={this.cbFooterMaxRowChange} cvTo={this.cbFooterToPage}/>}
			</div>
		}
		else
			throw new Error("列表组件必须提供data 和 cols属性");
	}
}
