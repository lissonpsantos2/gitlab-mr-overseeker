import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import {Spinner} from 'react-bootstrap';

import centralizer from '../../services/Centralizer';

import DefaultPage from '../../components/DefatultPage';

function Home() {
	const history = useHistory();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchData();
	}, []);

	async function fetchData() {
		await centralizer();

		setLoading(false);
		history.push('/groups');
	}

	function loadingInfo() {
		return (
			<>
				<Spinner animation="grow" />
				<br/>
				<br/>
				<span>LOADING GITLAB'S DATA</span>
			</>
		)
	}

	return (
		<DefaultPage>
			{loading && loadingInfo()}
		</DefaultPage>
	);
}

export default Home;
