import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import GroupService from '../../services/Group';
import ProjectService from '../../services/Project';

import DefaultPage from '../../components/DefatultPage';
import GroupTable from '../../components/GroupTable';
import ProjectTable from '../../components/ProjectTable';

function Group() {
	let { id } = useParams();
	const [groups, setGroups] = useState([]);
	const [projects, setProjects] = useState([]);

	useEffect(() => {
		loadGroups();
		loadProjects();
	}, [id]);

	function loadGroups() {
		let groups = GroupService.list().filter((group) => {
			return group.parent_id === id;
		});

		setGroups(groups);
	}

	function loadProjects() {
		const projects = ProjectService.listByGroup(id);

		console.log(projects);

		setProjects(projects);
	}

	return (
		<DefaultPage>
			{groups.length ? <GroupTable groups={groups} /> : ''}
			{projects.length ? <ProjectTable projects={projects} /> : ''}
		</DefaultPage>
	);
}

export default Group;
