import css from './Battle.module.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

function Battle(props) {
  return (
    <Router>
        <div className={css.container}>
            <h1 className={css.name} onClick={()=>{props.history.push('/')}}>
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

export default Battle;
