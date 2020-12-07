import React from 'react';
import { Link } from "react-router-dom";
import { Badge, Row, Col } from 'react-bootstrap';

import DefaultTable from '../DefaultTable';
import DefaultPieChart from '../DefaultPieChart';

function GroupTable(props) {
	const { groups } = props;

	function createGroupTags(groups) {
		const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'light'];

		return (
			groups.map((group, key) => {
				return (
					<Badge key={key} variant={variants[key]}>{group}</Badge>
				);
			})
		);
	}

	function createTableRows() {
		return (
			groups.map((group) => {
				return (
					<tr key={`${group.id}-${group.name}`}>
						<td>{group.id}</td>
						<td>{group.name} {createGroupTags(group.parent_groups)}</td>
						<td>{group.ready_merge_requests_count ?? 0}</td>
						<td>{group.wip_merge_requests_count ?? 0}</td>
						<td>{group.old_ready_merge_requests_count ?? 0}</td>
						<td>{group.old_wip_merge_requests_count ?? 0}</td>
						<td><Link to={`/groups/${group.id}`}>View</Link></td>
					</tr>
				);
			})
		);
	}

	function createWorkInProgressGraph() {
		const wip_merge_requests_count = groups.reduce((accumulator, group) => {
			return accumulator + group.wip_merge_requests_count;
		}, 0);

		const old_wip_merge_requests_count = groups.reduce((accumulator, group) => {
			return accumulator + group.old_wip_merge_requests_count;
		}, 0);

		const data = [];

		if (wip_merge_requests_count) {
			data.push({
				title: `(new) wip (${wip_merge_requests_count})`,
				value: wip_merge_requests_count,
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
		const ready_merge_requests_count = groups.reduce((accumulator, group) => {
			return accumulator + group.ready_merge_requests_count;
		}, 0);

		const old_ready_merge_requests_count = groups.reduce((accumulator, group) => {
			return accumulator + group.old_ready_merge_requests_count;
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
		const old_ready_merge_requests_count = groups.reduce((accumulator, group) => {
			return accumulator + group.old_ready_merge_requests_count;
		}, 0);

		const old_wip_merge_requests_count = groups.reduce((accumulator, group) => {
			return accumulator + group.old_wip_merge_requests_count;
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
				<Col><h3>Groups</h3></Col>
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
