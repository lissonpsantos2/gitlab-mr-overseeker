import axios from 'axios';
import config from '../config';

const api = axios.create({
	baseURL: 'https://gitlab.com/api/v4',
	headers: {
		'private-token': config.GITLAB_PRIVATE_TOKEN,
	},
});

export default api;
