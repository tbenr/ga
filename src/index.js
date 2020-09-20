import React from "react";
import ReactDOM from "react-dom";
import bootstrap from "bootstrap"; // eslint-disable-line no-unused-vars
import Charts from "./components/Charts";
import LiveCharts from "./components/LiveCharts";
import HeaderHtml from "./components/templates/HeaderHtml";

function App() {
  return (
    <div>
      <HeaderHtml />
      <div className="container-fluid py-3">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a
              className="nav-link active"
              href={{ void: 0 }}
              data-toggle="tab"
              data-target="#tabLiveCharts"
            >
              Live Charts
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              href={{ void: 0 }}
              data-toggle="tab"
              data-target="#tabCharts"
            >
              Charts
            </a>
          </li>
        </ul>
        <div className="tab-content">
          <div className="tab-pane" id="tabCharts">
            <Charts />
          </div>
          <div className="tab-pane active" id="tabLiveCharts">
            <LiveCharts />
          </div>
        </div>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
