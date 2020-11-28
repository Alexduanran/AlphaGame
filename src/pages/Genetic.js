import css from './Genetic.module.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import SnakeEnv from "../games/snake/SnakeEnv"
// import Pong from '../games/pong/Pong'

function Genetic(props) {
  return (
    <Router>
        <div className={css.container}>
            <h1 className={css.name} onClick={()=>{props.history.push('/')}}>
                AlphaGame
            </h1>
            <div className={css.background}>
                <div className={css.gameScreen}>
                    <Switch>
                        <Route path='/snake'>
                            <SnakeEnv />
                        </Route>
                        <Route path='/pong'>
                            {/* <Pong /> */}
                        </Route>
                        <Route path='/flappybird'>
                            flappybird
                        </Route>
                    </Switch>
                </div>
                <div className={css.plotScreen}>
                    <Switch>
                        <Route path='/snake'>
                            {/* <SnakeEnv /> */}
                            Snake
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
