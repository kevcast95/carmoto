
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {Provider} from "react-redux"
import configureStore from "./redux/store/Store";
import {ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import Landing from "./pages/Landing"
import Admin from "./pages/Administrator"
import ClientView from './pages/ClientView'
import DriverView from './pages/DriverView'
// contraseña firebase AbC123456_

const store = configureStore();
function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/">
            <Landing/>
          </Route>
          <Route path="/administrador">
            <Admin/>
          </Route>
          <Route path="/cliente">
            <ClientView/>
          </Route>
          <Route path="/conductor">
            <DriverView/>
          </Route>
        </Switch>
        <ToastContainer/>
      </Router>
    </Provider>
  );
}

export default App;
