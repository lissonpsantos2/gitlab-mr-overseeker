import api from './GitlabApi';

const namespace = '/projects';

export default class Project {
	static async liveList(data) {
		return api.get(`${namespace}`, data);
	}
	static async liveListByGroup(groupId, data) {
		return api.get(`/groups/${groupId}${namespace}`, data);
	}

	static listByGroup(groupId) {
		return JSON.parse(localStorage.getItem(`group-${groupId}-projects`));
	}
}
