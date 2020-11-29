import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import css from './Genetic.module.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";


import Pong from '../games/pong/Pong';
// import Game from './Game'

function Genetic(props) {
    const gameParentRef = useRef(null);
    const plotParentRef = useRef(null);
    const [gameScreenDimension, setGameScreenDimension] = useState({width: 0, height: 0});
    const [plotScreenDimension, setPlotScreenDimension] = useState({width: 0, height: 0});

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



    return (
        <Router>
            <div className={css.container}>
                <h1 className={css.name} onClick={()=>{props.history.push('/')}}>
                    AlphaGame
                </h1>
                <div className={css.background}>
                    <div className={css.gameScreen} ref={gameParentRef}>
                        <Switch>
                            <Route path='/snake'>
                                snake
                            </Route>
                            <Route path='/pong'>
                                {
                                    gameScreenDimension.width === 0 ?
                                    <div></div> : <Pong dimension={[gameScreenDimension.width, gameScreenDimension.height]}/>
                                }
                            </Route>
                            <Route path='/flappybird'>
                                flappybird
                            </Route>
                        </Switch>
                    </div>
                    <div className={css.plotScreen} ref={plotParentRef}>
                        <Switch>
                            <Route path='/snake'>
                                snake
                            </Route>
                            <Route path='/pong'>
                                pong
                            </Route>
                            <Route path='/flappybird'>
                                flappybird
                            </Route>
                        </Switch>
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default Genetic;
