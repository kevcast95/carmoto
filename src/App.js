
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import Landing from "./pages/Landing"
import Admin from "./pages/Administrator"
// contraseña firebase AbC123456_
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Landing/>
        </Route>
        <Route path="/mio">
          <Admin/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
