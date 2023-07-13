import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  showGraph: boolean, //variable type decalaration (require for typescript)
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props); //component is the base class, super calls the base class constructor and sets it up for App component

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      showGraph: false, //initial state of showGraph is false, changes when we click the button
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    console.log(this.state.showGraph);
    if(this.state.showGraph){ //if showGraph state is true, render the graph
    return (<Graph data={this.state.data}/>)
    }
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    let x = 0; //variable to track the number of times getDataFromServer() is called
    const intervalID = setInterval(() => { //getting the data from the server every certain interval time period
      //intervalID keeps track of this particular interval instance, useful when we want to stop the interval and this
      //callback function from repeatedly executing
    DataStreamer.getData((serverResponds: ServerRespond[]) => {
      this.setState({ data: [...this.state.data, ...serverResponds],
                      showGraph: true }); //the spread operator spread the original array and add new content to it
    });
    x++;  //updating counter each time the function is called
    if(x>1000){ //if the function is called more than 1000 times, stop the interval
      clearInterval(intervalID);
      //resembles the componentWillUnmount() method in React.Component
    }
  },100);
}

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            // when button is click, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => {this.getDataFromServer()}}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
