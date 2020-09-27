import React from "react";
import dataLineChart from "../data/linechart.json";
import { defaults, Line} from "react-chartjs-2";
import helpers from "../helpers";

// set global chartjs defaults
defaults.global.responsive = true;
defaults.global.defaultColor = "rgba(0, 0, 90, 0.7)";
defaults.global.legend.position = "bottom";
defaults.global.legend.labels.pointStyle = "circle";
defaults.global.legend.labels.usePointStyle = true;
defaults.global.legend.labels.fontSize = 12;

const colors = [
  {
    // blue
    borderWidth: 0,
    borderColor: "rgba(101,147,185,1)",
    backgroundColor: ["rgba(101,147,185,0.8)"],
    pointBackgroundColor: "rgba(255,255,255,0.8)",
    pointBorderColor: "rgba(101,147,185,1)",
    pointHoverBorderColor: "magenta",
    pointHoverBorderWidth: 1
  },
  {
    // pinky
    borderWidth: 0,
    borderColor: "rgba(220,120,220,1)",
    backgroundColor: "rgba(220,120,220,0.8)",
    pointBackgroundColor: "rgba(255,255,255,0.8)",
    pointBorderColor: "rgba(220,120,220,1)",
    pointHoverBorderColor: "#333",
    pointHoverBorderWidth: 1
  },
  {
    // red
    borderWidth: 0,
    borderColor: "rgba(247,70,74,1)",
    backgroundColor: "rgba(247,70,74,0.7)",
    pointBackgroundColor: "rgba(255,255,255,0.8)",
    pointBorderColor: "rgba(247,70,74,1)",
    pointHoverBorderColor: "rgba(0,0,0,0.7)",
    pointHoverBorderWidth: 1,
    pointHoverBackgroundColor: "rgba(247,70,74,1)"
  },
  {
    // lime
    borderWidth: 0,
    borderColor: "lime",
    backgroundColor: "lime",
    pointBackgroundColor: "lime"
  }
];

export class LiveCharts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lineData: this.mergeColorsIntoData(dataLineChart),
      lineupdates: 0,
      myTotalEth_sens: 0.001,
      totalEth_sens: 5
    };

    /* for live data */
    this.updateLiveData = this.updateLiveData.bind(this);
    this.mergeColorsIntoData = this.mergeColorsIntoData.bind(this);
  }

  optionsLine() {
    return {
      legend: {
        display: true
      },
      scales: {
        xAxes: [{
            type: 'time',
            time: {
              unit: 'day'
            }
        }],
        yAxes: [
          {
            position: 'right',
            id: 'y-axis-myTotalEth'
          },
          {
            position: 'left',
            id: 'y-axis-totalEth'
          }
        ]
    }
    };
  }


  mergeColorsIntoData(srcData) {
    /* This function merges from a "global" colors array into datadset 
     * colors. This allow us to dynamically change the colors and keep
     * the color definitions separate from the data.
    */
    return {
      ...srcData,
      datasets: srcData.datasets.map((dataset, k) => {
        return { ...dataset, ...colors[k] };
      })
    };
  }

  componentDidMount() {
    if (
      this.state.lineData &&
      this.state.lineData.labels &&
      this.state.lineData.datasets.length > 0
    ) {
      this.updateLiveData("lineData");
    }
    if (
      this.state.barData &&
      this.state.barData.labels &&
      this.state.barData.datasets.length > 0
    ) {
      //uncomment to auto-start bar chart
      //this.runInterval("barTimer", "barData");
    }
    if (
      this.state.bubbleData &&
      this.state.bubbleData.labels &&
      this.state.bubbleData.datasets.length > 0
    ) {
      //uncomment to auto-start bubble chart
      //this.runInterval("bubbleTimer", "bubbleData");
    }
  }

  updateLiveData(dataName) {
    var _self = this;
    if (
      _self.state[dataName] &&
      _self.state[dataName].datasets &&
      _self.state[dataName].datasets.length > 0
    ) {
      let newlineupdates = _self.state.lineupdates + 1;
    fetch(window.location.protocol + '//' +window.location.host.replace(/:.*/,"") + ':7070/getdata')
        .then(res => res.json())
        .then((data) => {
          var newData = {};

          newData = {
            //labels: ["X", "M", "T", "W", "X", "F", "S"],
            datasets: [
              {
                label: "myTotalEth ("+newlineupdates+")",
                fill: false,
                data: helpers.getDatasetFromRows(data,"timestamp","myTotalEth", this.state.myTotalEth_sens),
                yAxisID: 'y-axis-myTotalEth'
              },
              {
                label: "totalEth ("+newlineupdates+")",
                fill: false,
                data: helpers.getDatasetFromRows(data,"timestamp","totalEth",this.state.totalEth_sens),
                yAxisID: 'y-axis-totalEth'
              }
             /* {
                label: "Update " + ctr + 2,
                data: helpers.getRandomArr(7, liveDataMin, liveDataMax)
              }*/
            ]
          };
      
          this.setState({
            [dataName]: this.mergeColorsIntoData(newData),
            lineupdates: newlineupdates
          });
        })
        .catch(console.log)
      }
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12 py-3">
          <div className="card shadow">
            <div className="card-body text-center">
              <h4 className="mb-4">
                myGanghi Chart
                <button
                  className="btn btn-sm btn-outline-primary align-top ml-2"
                  onClick={() =>
                    this.updateLiveData("lineData")
                  }
                >
                  {<span>Update {this.state.lineupdates}</span>}
                </button>
                <input name="myTotalEth_sens" value={this.state.myTotalEth_sens} onChange={(v)=> this.setState({myTotalEth_sens: v.target.value})} />
                <input name="totalEth_sens" value={this.state.totalEth_sens} onChange={(v)=> this.setState({totalEth_sens: v.target.value})} />
              </h4>
              <Line
                ref="chart1"
                data={this.state.lineData}
                options={this.optionsLine()}
              />
            </div>
          </div>
        </div>
{/*         <div className="col-lg-6 py-3">
          <div className="card shadow">
            <div className="card-body text-center">
              <h4 className="mb-4">
                Bar Chart
                <button
                  className="btn btn-sm btn-outline-primary align-top ml-2"
                  onClick={timer => this.toggleInterval("barTimer", "barData")}
                >
                  {this.state.barTimer ? <span>Stop</span> : <span>Live</span>}
                </button>
              </h4>
              <Bar data={this.state.barData} options={this.optionsBar()} />
            </div>
          </div>
        </div> */}
{/*         <div className="col-lg-6 py-3">
          <div className="card shadow">
            <div className="card-body text-center">
              <h4 className="mb-4">
                Bubble Chart
                <button
                  className="btn btn-sm btn-outline-primary align-top ml-2"
                  onClick={timer =>
                    this.toggleInterval("bubbleTimer", "bubbleData")
                  }
                >
                  {this.state.bubbleTimer ? (
                    <span>Stop</span>
                  ) : (
                    <span>Live</span>
                  )}
                </button>
              </h4>
              <Bubble
                data={this.state.bubbleData}
                options={{ legend: { display: false } }}
              />
            </div>
          </div>
        </div> */}
      </div>
    );
  }
}

export default LiveCharts;
