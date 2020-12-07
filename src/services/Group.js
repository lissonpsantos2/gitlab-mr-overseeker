import api from './GitlabApi';

const namespace = '/groups';

export default class Group {
	static async liveList(data) {
		return api.get(`${namespace}`, data);
	}

	static list() {
		return JSON.parse(localStorage.getItem('groups'));
	}
}
