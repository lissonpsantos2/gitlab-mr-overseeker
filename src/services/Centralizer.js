import config from '../config';
import GroupService from './Group';
import ProjectService from './Project';
import MergeRequestService from './MergeRequest';

export default async function () {
	localStorage.clear();

	let groups = await processGroups();
	let projects = await processProjects(groups);
	let merge_requests = await processMergeRequests(groups);

	saveDataOnLocalStorage(groups, projects, merge_requests);
}

async function processGroups() {
	let groups = [];

	let groupsi = await GroupService.liveList({params: {owned: true}});
	groups = groupsi.data

	groups.map((group) => {
		const parent_group = getGroupById(group.parent_id);

		if (parent_group) {
			group.parent_groups = getGroupParents(parent_group);
		} else {
			group.parent_groups = [];
		}
		return group;
	});

	return groups;

	function getGroupParents(group) {
		let new_parents = [];
		if (group.parent_id) {
			new_parents = getGroupParents(getGroupById(group.parent_id));
			new_parents.push(group.name);
			return new_parents;
		}
		return [group.name];
	}

	function getGroupById(id) {
		const filtered_ns = groups.filter((group) => {
			return group.id === id;
		});

		if (filtered_ns.length) {
			return filtered_ns[0];
		}
		return null;
	}
}

async function processProjects(groups) {
	let projects = [];

	for (let i = 0; i < groups.length; i++) {
		let group_projects = (await ProjectService.liveListByGroup(groups[i].id, {
			params: {
				owned: true,
				simple: true,
				per_page: 100
			}
		})).data;

		group_projects.map((project) => {
			project.group_id = groups[i].id;
			return project;
		})

		projects = [...projects, ...group_projects];
	}

	return projects;
}

async function processMergeRequests(groups) {
	let merge_requests = [];
	let unique_merge_requests = [];
	let unique_merge_request_ids = [];

	for (let i = 0; i < groups.length; i++) {
		let project_merge_requests = (await MergeRequestService.liveListByGroup(groups[i].id, {
			params: {
				owned: true,
				simple: true,
				state: 'opened',
				per_page: 100
			}
		})).data;

		merge_requests = [...merge_requests, ...project_merge_requests];
	}

	merge_requests.forEach(merge_request => {
		if (!unique_merge_request_ids.includes(merge_request.id)) {
			unique_merge_requests.push(merge_request);
			unique_merge_request_ids.push(merge_request.id);
		}
	});

	return unique_merge_requests;
}

function saveDataOnLocalStorage(groups, projects, merge_requests) {
	merge_requests.map((merge_request) => {
		const createdAt = new Date(merge_request.created_at);
		const today = new Date();
		const diffTime = Math.abs(createdAt - today);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		merge_request.is_old = diffDays > config.OLD_LIMIT_DAYS;

		return merge_request;
	});

	projects.map((project) => {
		project.ready_merge_requests_count = merge_requests.filter((merge_request) => {
			return merge_request.project_id === project.id && !merge_request.work_in_progress;
		}).length;

		project.old_ready_merge_requests_count = merge_requests.filter((merge_request) => {
			return merge_request.project_id === project.id && !merge_request.work_in_progress && merge_request.is_old;
		}).length;

		project.wip_merge_requests_count = merge_requests.filter((merge_request) => {
			return merge_request.project_id === project.id && merge_request.work_in_progress;
		}).length;

		project.old_wip_merge_requests_count = merge_requests.filter((merge_request) => {
			return merge_request.project_id === project.id && merge_request.work_in_progress && merge_request.is_old;
		}).length;

		project.wip_merge_requests_count -= project.old_wip_merge_requests_count;
		project.ready_merge_requests_count -= project.old_ready_merge_requests_count;

		return project;
	});

	groups.map((group) => {
		const group_projects = projects.filter((project) => {
			return project.group_id === group.id;
		});

		group.ready_merge_requests_count = group_projects.reduce((accumulator, project) => {
			return accumulator + project.ready_merge_requests_count;
		}, 0);

		group.old_ready_merge_requests_count = group_projects.reduce((accumulator, project) => {
			return accumulator + project.old_ready_merge_requests_count;
		}, 0);

		group.wip_merge_requests_count = group_projects.reduce((accumulator, project) => {
			return accumulator + project.wip_merge_requests_count;
		}, 0);

		group.old_wip_merge_requests_count = group_projects.reduce((accumulator, project) => {
			return accumulator + project.old_wip_merge_requests_count;
		}, 0);

		return group;
	});

	localStorage.setItem('groups', JSON.stringify(groups));
	localStorage.setItem('projects', JSON.stringify(projects));
	localStorage.setItem('merge_requests', JSON.stringify(merge_requests));

	groups.forEach((group) => {
		const group_projects = projects.filter((project) => {
			return project.group_id === group.id;
		});

		group_projects.forEach((project) => {
			const project_merge_requests = merge_requests.filter((merge_request) => {
				return merge_request.project_id === project.id;
			});

			localStorage.setItem(`project-${project.id}-merge_requests`, JSON.stringify(project_merge_requests));
		});

		localStorage.setItem(`group-${group.id}-projects`, JSON.stringify(group_projects));
	});
}
