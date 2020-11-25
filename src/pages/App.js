import css from './App.module.css';
import Home from './Home'
import Genetic from './Genetic'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


function App() {
  return (
    <div>
      <Router basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route path='/'>
            <Genetic />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
