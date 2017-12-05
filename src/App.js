import React, { Component } from 'react';
import { Link, Route, Switch ,Redirect } from 'react-router-dom';

import route_select from "./js/route/route_select";
import route_listView from "./js/route/route_listView";

import logo from './logo.svg';
import './App.css';
import "./css/font-awesome.min.css";

class App extends Component {
	render() {
		return (
			<main>
				<header className="top">
					React 组件示例
					<nav>
						<Link to="/select">选择框</Link>
						<Link to="/listView">列表</Link>
					</nav>
				</header>
				<Switch>
					<Route exact path="/select" component={route_select}/>
					<Route exact path="/listView" component={route_listView}/>
					<Redirect to="/"/>
				</Switch>
			</main>
		);
	}
}

export default App;
