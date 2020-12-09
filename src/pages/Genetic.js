import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import css from './Genetic.module.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import GeneticParams from './GeneticParams';
import Plot from './Plot';
import Pong from '../games/pong/Pong';
import Snake from '../games/snake/genetic_algorithm/Snake';
import Flappy from '../games/flappy_bird/Flappy';

function Genetic(props) {
    const gameParentRef = useRef(null);
    const plotParentRef = useRef(null);
    const [gameScreenDimension, setGameScreenDimension] = useState({width: 0, height: 0});
    const [plotScreenDimension, setPlotScreenDimension] = useState({width: 0, height: 0});
    const [settings, setSettings] = useState({
                                    'hiddenLayerArchitecture': null,
                                    'mutationRate': null,
                                    'mutationRateType': null,
                                    'numParents': null,
                                    'numOffsprings': null
                                    })
    const [start, setStart] = useState(false);
    const [avgFitness, setAvgFitness] = useState([[0,1000]]);
    const [maxFitness, setMaxFitness] = useState([[0,1000]]);

    const addAvgFitness = (avgFitness_) => {
        setAvgFitness(avgFitness => [...avgFitness, [avgFitness.length, avgFitness_]]);
    } 

    const addMaxFitness = (maxFitness_) => {
        setMaxFitness(maxFitness => [...maxFitness, [maxFitness.length, maxFitness_]]);
    }

    useEffect ( () => {
        if (gameParentRef.current) {
            setGameScreenDimension({
                width: gameParentRef.current.offsetWidth,
                height: gameParentRef.current.offsetHeight
            });
        }
        if (plotParentRef.current) {
            setPlotScreenDimension({
                width: plotParentRef.current.offsetWidth,
                height: plotParentRef.current.offsetHeight
            });
        }
    }, [gameParentRef, plotParentRef]);

    const updateSettings = (hiddenLayerArchitecture, 
                            mutationRate, 
                            mutationRateType,
                            numParents,
                            numOffsprings) => {
        setSettings({'hiddenLayerArchitecture': hiddenLayerArchitecture,
                    'mutationRate': mutationRate,
                    'mutationRateType': mutationRateType,
                    'numParents': numParents,
                    'numOffsprings': numOffsprings})
    }

    const updateStart = () => {
        setStart(!start);
        setAvgFitness([]);
        setMaxFitness([]);
    }

    return (
        <Router basename={process.env.PUBLIC_URL}>
            <div className={css.container}>
                <h1 className={css.name} onClick={()=>{props.history.push(process.env.PUBLIC_URL+'/')}}>
                    <Link to='/' className={css.text}>
                        AlphaGame
                    </Link>
                </h1>
                <div className={css.background}>
                    <div className={css.gameScreen} ref={gameParentRef}>
                        {
                            !start ?
                            <GeneticParams updateSettings={updateSettings} updateStart={updateStart}/>
                            :
                            <Switch>
                                <Route path='/snake'>
                                    {
                                        gameScreenDimension.width === 0 ?
                                        <div></div> : <Snake dimension={[gameScreenDimension.width, gameScreenDimension.height]}
                                                            settings={settings}
                                                            updateStart={updateStart}
                                                            addAvgFitness={addAvgFitness}
                                                            addMaxFitness={addMaxFitness}/>
                                    }
                                </Route>
                                <Route path='/pong'>
                                    {
                                        gameScreenDimension.width === 0 ?
                                        <div></div> : <Pong dimension={[gameScreenDimension.width, gameScreenDimension.height]}
                                                            settings={settings}
                                                            updateStart={updateStart}
                                                            addAvgFitness={addAvgFitness}
                                                            addMaxFitness={addMaxFitness}/>
                                    }
                                </Route>
                                <Route path='/flappybird'>
                                    {
                                        gameScreenDimension.width === 0 ?
                                        <div></div> : <Flappy dimension={[gameScreenDimension.width, gameScreenDimension.height]}
                                                            settings={settings}
                                                            updateStart={updateStart}
                                                            addAvgFitness={addAvgFitness}
                                                            addMaxFitness={addMaxFitness}/>
                                    }
                                </Route>
                            </Switch>
                        }
                    </div>
                    <div className={css.plotScreen} ref={plotParentRef}>
                        {
                            plotScreenDimension.width === 0 ?
                            <div></div> : <Plot dimension={[plotScreenDimension.width, plotScreenDimension.height]}
                                                avgFitness={avgFitness}
                                                maxFitness={maxFitness}/>
                        }   
                    </div>
                </div>
            </div>
            <footer>
                Copyright © 2020 AlphaGame | 
                <a href='https://github.com/Alexduanran/AlphaGame' target='_blank' style={{textDecoration: 'none', color:'white'}}> Github</a>
            </footer>
        </Router>
    );
}

export default Genetic;
