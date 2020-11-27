import css from './App.module.css';
import Home from './Home';
import Genetic from './Genetic';
import Reinforcement from './Reinforcement';
import Battle from './Battle';
import {
  Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

function App() {
  return (
    <div>
      <Router history={history}>
        <Switch>
          <Route path='/*/genetic'>
            <Genetic history={history}/>
          </Route>
          <Route path='/*/reinforcement'>
            <Reinforcement history={history}/>
          </Route>
          <Route path='*/battle'>
            <Battle history={history}/>
          </Route>
          <Route path='/'>
            <Home history={history}/>
          </Route>
        </Switch>
      </Router>
      {/* <footer>
        Copyright © 2020 AlphaGame
      </footer> */}
    </div>
  );
}

export default App;
