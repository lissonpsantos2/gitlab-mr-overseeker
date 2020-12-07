import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import HomePage from './pages/Home';
import GroupListPage from './pages/GroupList';
import GroupPage from './pages/Group';

export default function BasicExample() {
	return (
		<Router>
			<Switch>
				<Route exact path="/">
					<HomePage />
				</Route>
				<Route path="/groups/:id">
          <GroupPage />
        </Route>
				<Route path="/groups">
					<GroupListPage />
				</Route>
			</Switch>
		</Router>
	);
}
