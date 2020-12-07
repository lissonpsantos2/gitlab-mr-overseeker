import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';

export default function (props) {
	return (
		<PieChart
			data={props.data}
			lineWidth={20}
			paddingAngle={18}
			rounded
			label={({ dataEntry }) => dataEntry.title}
			labelStyle={(index) => ({
				fill: props.data[index].color,
				fontSize: '5px',
				fontFamily: 'sans-serif',
			})}
			labelPosition={50}
		/>
	);
}
