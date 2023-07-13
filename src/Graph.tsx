import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

/**
 * Props declaration for <Graph />
 */
interface IProps {
  data: ServerRespond[],
}

/**
 * Perspective library adds load to HTMLElement prototype.
 * This interface acts as a wrapper for Typescript compiler.
 */
interface PerspectiveViewerElement extends HTMLElement{ //PerspectiveViewerElement is a custom type of HTMLElement
  load: (table: Table) => void, //load is a function that takes in a table and returns void
}

/**
 * React component that renders Perspective based on data
 * parsed from its parent through data property.
 */
class Graph extends Component<IProps, {}> {
  // Perspective table
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer'); //create a perspective-viewer element and mount it on the DOM
  }

  componentDidMount() { //this life cycle method is called after the component is mounted on the DOM

    // Get element to attach the table from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;
    //this basically looks for the first element with the tag name 'perspective-viewer' and cast it to PerspectiveViewerElement

    const schema = {  //defines the schema that is going to be used in the table
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {  //we create a table object using the schema
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) { //when table exists
      //we load the table object into the perspective-viewer element that we created earlier
      elem.load(this.table);

      //we further define other configurations for the perspective-viewer element
      elem.setAttribute('view','y_line'); //setting the view to y_axis
      elem.setAttribute('column-pivots','["stock"]'); //setting the column-pivots to stock
      elem.setAttribute('row-pivots','["timestamp"]'); //setting the row-pivots to timestamp
      elem.setAttribute('columns','["top_ask_price"]'); //setting the columns to top_ask_price
      //aggregates is used to define the type of calculation to be performed on the data
      elem.setAttribute('aggregates',`{ 
        "stock":"distinct count",
        "top_ask_price":"avg",
        "top_bid_price":"avg",
        "timestamp":"distinct count"
      }`)
    }
  }

  componentDidUpdate() {
    // Everytime the data props is updated, insert the data into Perspective table
    if (this.table) {
      // As part of the task, you need to fix the way we update the data props to
      // avoid inserting duplicated entries into Perspective table again.
      this.table.update(this.props.data.map((el: any) => {
        // Format the data from ServerRespond to the schema
        return {
          stock: el.stock,
          top_ask_price: el.top_ask && el.top_ask.price || 0,
          top_bid_price: el.top_bid && el.top_bid.price || 0,
          timestamp: el.timestamp,
        };
      }));
    }
  }
}

export default Graph;
