import React, { useState, useEffect } from 'react';
import { Chart } from 'react-charts';

function Plot(props) {

    const data = React.useMemo(
        () => [
            {
                label: 'Average Fitness',
                data: props.avgFitness
            },
            {
                label: 'Max Fitness',
                data: props.maxFitness
            }
        ],
        [props.avgFitness, props.maxFitness]
    )

    const axes = React.useMemo(
        () => [
            { primary:true, type:'linear', position:'bottom', show:props.avgFitness},
            { type:'linear', position: 'left', show:props.maxFitness},
        ],
        [props.avgFitness, props.maxFitness]
    )

    return (
        <div
            style ={{
                width: props.dimension[0],
                height: props.dimension[1],
                background: 'black'
            }}
        >
            <Chart data={data} axes={axes} tooltip primaryCursor dark/>
        </div>
    )
}

export default Plot;