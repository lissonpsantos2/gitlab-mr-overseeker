import React from 'react';
import { Row, Col } from 'react-bootstrap';

import DefaultTable from '../DefaultTable';
import DefaultPieChart from '../DefaultPieChart';

function GroupTable(props) {
	const { projects } = props;

	function createTableRows() {
		return (
			projects.map((project) => {
				return (
					<tr key={`${project.id}-${project.name}`}>
						<td>{project.id}</td>
						<td>{project.name}</td>
						<td>{project.ready_merge_requests_count ?? 0}</td>
						<td>{project.wip_merge_requests_count ?? 0}</td>
						<td>{project.old_ready_merge_requests_count ?? 0}</td>
						<td>{project.old_wip_merge_requests_count ?? 0}</td>
						{/* <td><Link to={`/projects/${project.id}`}>View</Link></td> */}
						<td>---</td>
					</tr>
				);
			})
		);
	}

	function createWorkInProgressGraph() {
		const wip_merge_requests_count = projects.reduce((accumulator, project) => {
			return accumulator + project.wip_merge_requests_count;
		}, 0);

		const old_wip_merge_requests_count = projects.reduce((accumulator, project) => {
			return accumulator + project.old_wip_merge_requests_count;
		}, 0);

		const data = [];

		if (wip_merge_requests_count - old_wip_merge_requests_count > 0) {
			data.push({
				title: `(new) wip (${wip_merge_requests_count - old_wip_merge_requests_count})`,
				value: wip_merge_requests_count - old_wip_merge_requests_count,
				color: '#e6b525'
			});
		}

		if (old_wip_merge_requests_count) {
			data.push({
				title: `(old) wip (${old_wip_merge_requests_count})`,
				value: old_wip_merge_requests_count,
				color: '#e64525'
			});
		}

		return <DefaultPieChart data={data} />;
	}

	function createReadyGraph() {
		const ready_merge_requests_count = projects.reduce((accumulator, project) => {
			return accumulator + project.ready_merge_requests_count;
		}, 0);

		const old_ready_merge_requests_count = projects.reduce((accumulator, project) => {
			return accumulator + project.old_ready_merge_requests_count;
		}, 0);

		const data = [];

		if (ready_merge_requests_count) {
			data.push({
				title: `(new) ready (${ready_merge_requests_count})`,
				value: ready_merge_requests_count,
				color: '#49AB56'
			});
		}

		if (old_ready_merge_requests_count) {
			data.push({
				title: `(old) ready (${old_ready_merge_requests_count})`,
				value: old_ready_merge_requests_count,
				color: '#e64525'
			});
		}

		return <DefaultPieChart data={data} />;
	}

	function createOldGraph() {
		const old_ready_merge_requests_count = projects.reduce((accumulator, project) => {
			return accumulator + project.old_ready_merge_requests_count;
		}, 0);

		const old_wip_merge_requests_count = projects.reduce((accumulator, project) => {
			return accumulator + project.old_wip_merge_requests_count;
		}, 0);

		const data = [];

		if (old_ready_merge_requests_count) {
			data.push({
				title: `(ready) old (${old_ready_merge_requests_count})`,
				value: old_ready_merge_requests_count,
				color: '#49AB56'
			});
		}

		if (old_wip_merge_requests_count) {
			data.push({
				title: `(wip) old (${old_wip_merge_requests_count})`,
				value: old_wip_merge_requests_count,
				color: '#e64525'
			});
		}

		return <DefaultPieChart data={data} />;
	}

	return (
		<>
			<Row className='mb-5'>
				<Col><h3>Projects</h3></Col>
			</Row>
			<Row className='mb-5'>
				<Col>{createReadyGraph()}</Col>
				<Col>{createWorkInProgressGraph()}</Col>
				<Col>{createOldGraph()}</Col>
			</Row>
			<DefaultTable>
				{createTableRows()}
			</DefaultTable>
		</>
	);
}

export default GroupTable;
