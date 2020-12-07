import api from './GitlabApi';

const namespace = '/merge_requests';

export default class MergeRequest {
	static async liveList(data) {
		return api.get(`${namespace}`, data);
	}
	static async liveListByProject(projectId, data) {
		return api.get(`/projects/${projectId}${namespace}`, data);
	}
	static async liveListByGroup(groupId, data) {
		return api.get(`/groups/${groupId}${namespace}`, data);
	}
}
