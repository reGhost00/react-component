import React, { Component } from 'react';
import CPMT_listView from "../component/cpmt_listView";
import "../../css/cpmt_listView.css";
export default class extends Component{
	constructor(props){
		super(props);
		let tree=[], tmp=[];
		for(var i=0; i<53; i++){
			for(var j=0; j<11; j++)
				tmp.push({id:j, name: "fuck", title:"again", number:j, remark:"time"});
			tree.push({id:i, name:"fuck", title:"you", number:i, remark:"time", list:tmp});
			tmp = [];
		}

		this.state = {
			tree: tree,
			footer:true,
			check:false,
			multiple:false,
		}
	}
	render(){
		const cols = [
			{name:"name", title:"动作"},
			{name:"title", title:"对象"},
			{name:"number", title:"次数"},
			{name:"remark", title:"备注"}
		];

		const style = {
			container:"CPMT_listView",	//列表项容器样式
			header:"header",	//列表头样式
			list:"list",	//列表项容器样式
			item:{	//列表项样式
				container:"item",	//列表项容器样式
				sub:["item","sub"]	//二级列表容器样式
			},
			footer:{	//列表脚样式
				container:"footer",
				input:"toPage",
				button:"btn",
				select:{
					container:"pageRows",
					title:"rows",
					arrow:"arrow",
					list:"list"
				}
			}
		};

		return <div>
			<h1>列表组件示例</h1>
			<label>列表脚<input type="checkbox" value={this.state.footer}  onChange={()=>this.setState({footer:!this.state.footer })}/></label>
			<label>允许选中<input type="checkbox" value={this.state.check}  onChange={()=>this.setState({check:!this.state.check })}/></label>
			<label>允许多选<input type="checkbox" value={this.state.multiple } onChange={()=>this.setState({multiple:!this.state.multiple })}/></label>
			<div>
				<CPMT_listView data={this.state.tree} cols={cols} style={style} maxRow="7" check={this.state.check} multiple={this.state.multiple} footer={this.state.footer} cvRowClick={tar => console.log("cvRowClick ", tar)}/>
			</div>

		</div>
	}
}
