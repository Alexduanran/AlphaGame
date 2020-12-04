import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import css from './Genetic.module.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import Pong from '../games/pong/Pong';
import SnakeEnv from '../games/snake/SnakeEnv';
import Flappy from '../games/flappy_bird/Flappy';
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
        <Router basename={process.env.PUBLIC_URL}>
            <div className={css.container}>
                <h1 className={css.name} onClick={()=>{props.history.push(process.env.PUBLIC_URL+'/')}}>
                    <Link to='/' className={css.text}>
                        AlphaGame
                    </Link>
                </h1>
                <div className={css.background}>
                    <div className={css.gameScreen} ref={gameParentRef}>
                        <Switch>
                            <Route path='/snake'>
                                Snake
                            </Route>
                            <Route path='/pong'>
                                {
                                    gameScreenDimension.width === 0 ?
                                    <div></div> : <Pong dimension={[gameScreenDimension.width, gameScreenDimension.height]}/>
                                }
                            </Route>
                            <Route path='/flappybird'>
                                {
                                    gameScreenDimension.width === 0 ?
                                    <div></div> : <Flappy dimension={[gameScreenDimension.width, gameScreenDimension.height]}/>
                                }
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
            <footer className={css.footer}>
                Copyright © 2020 AlphaGame | 
                <a href='https://github.com/Alexduanran/AlphaGame' target='_blank' style={{textDecoration: 'none', color:'white'}}> Github</a>
            </footer>
        </Router>
    );
}

export default Genetic;
