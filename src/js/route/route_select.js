import React, { Component } from 'react';
import CPMT_select from "../component/cpmt_select";
import "../../css/cpmt_select.css";
export default class extends Component{
	constructor(props){
		super(props);
		let list1=[], list2=[], icon=["fa-bomb", "fa-cloud", "fa-key", "fa-male", "fa-star"];
		for(var i=0; i<5; i++){
			list1.push({id:i, title:`fuck${i*i+1}`});
			list2.push({id:i, title:`bitch${i*i+1}`, icon:`fa ${icon[i]}`});
		}

		this.state = {
			list1: list1,
			select1: "",
			list2: list2,
			select2: ""
		};

		this.cbSelect1Click = this.cbSelect1Click.bind(this);
		this.cbSelect2Click = this.cbSelect2Click.bind(this);
		this.cbTitClick = this.cbTitClick.bind(this);
		this.cbMaskClick = this.cbMaskClick.bind(this);
	}
	cbSelect1Click(tar){
		console.log("cvSelectClick ", tar);
		this.setState({select1:this.state.list1[tar.dataset.id].title});
	}
	cbSelect2Click(tar){
		console.log("cvSelectClick ", tar);
		this.setState({select2:this.state.list2[tar.dataset.id].title});
	}
	cbTitClick(tar){
		console.log("cvTitleClick", tar);
	}
	cbMaskClick(tar){
		console.log("cbMaskClick", tar);
	}
	render(){
		const style = {
			container:"CPMT_select",
			title:"title",
			arrow:["fa", "fa-caret-down"],
			list:"list"
		};

		return <div>
			<h1>下拉列表示例</h1>
			<div className="sample">
				<span className="typeTitle">无图标</span>
				<CPMT_select hover={true} data={this.state.list1} style={style} cvListClick={this.cbSelect1Click} cvTitleClick={this.cbTitClick} cvMaskClick={this.cbMaskClick}/>
				<span>{this.state.select1}</span>
			</div>
			<div className="sample">
				<span className="typeTitle">有图标</span>
				<CPMT_select hover={true} data={this.state.list2} style={style} cvListClick={this.cbSelect2Click} cvTitleClick={this.cbTitClick} cvMaskClick={this.cbMaskClick}/>
				<span>{this.state.select2}</span>
			</div>
		</div>
	}
}
