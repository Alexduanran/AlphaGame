import css from './Battle.module.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

function Battle(props) {
  return (
    <Router basename={process.env.PUBLIC_URL}>
        <div className={css.container}>
            <h1 className={css.name} onClick={()=>{props.history.push(process.env.PUBLIC_URL+'/')}}>
                <Link to='/' className={css.text}>
                    AlphaGame
                </Link>
            </h1>
            <div className={css.background}>
                <div className={css.gameScreen}>
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
                <div className={css.plotScreen}>
                    <Switch>
                        <Route path='/snake'>
                            {/* {
                                gameScreenDimension.width === 0 ?
                                <div></div> : 
                                <SnakeEnv dimension={[gameScreenDimension.width, gameScreenDimension.height]}/>
                            } */}
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
        <footer>
            Copyright © 2020 AlphaGame | 
            <a href='https://github.com/Alexduanran/AlphaGame' target='_blank' style={{textDecoration: 'none', color:'white'}}> Github</a>
        </footer>
    </Router>
  );
}

export default Battle;
