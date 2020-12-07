import React, { useEffect, useState } from 'react';
import GroupService from '../../services/Group';

import DefaultPage from '../../components/DefatultPage';
import GroupTable from '../../components/GroupTable';

function GroupList() {
	const [groups, setGroups] = useState([]);

	useEffect(() => {
		loadGroups();
	}, []);

	function loadGroups() {
		let groups = GroupService.list();

		console.log(groups);

		setGroups(groups);
	}

	return (
		<DefaultPage>
			<GroupTable groups={groups} />
		</DefaultPage>
	);
}

export default GroupList;
