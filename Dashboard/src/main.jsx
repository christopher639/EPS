import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import App from './App.jsx'
import './index.css'
import { HashRouter } from "react-router-dom";
createRoot(document.getElementById('root')).render(
  <HashRouter>
    <App />
  </HashRouter>
);



