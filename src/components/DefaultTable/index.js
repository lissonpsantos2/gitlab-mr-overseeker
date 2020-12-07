import React from 'react';
import { Table } from 'react-bootstrap';

export default function (props) {
	return (
		<>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th rowspan="2">id</th>
						<th rowspan="2">Name</th>
						<th colspan="4">MRs</th>
						<th rowspan="2">Actions</th>
					</tr>
					<tr>
						<th>RDY qty</th>
						<th>WIP qty</th>
						<th>OLD RDY qty</th>
						<th>OLD WIP qty</th>
					</tr>
				</thead>
				<tbody>
					{props.children}
				</tbody>
			</Table>
		</>
	);
}
