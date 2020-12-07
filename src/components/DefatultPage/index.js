import React from 'react';
import {Col, Container, Row} from 'react-bootstrap';

function DefaultPage(props) {
	const { children } = props;

	return (
		<Container className="h-100">
			<Row className="h-100">
				<Col className="my-auto">{children}</Col>
			</Row>
		</Container>
	);
}

export default DefaultPage;
