import React from 'react';
import ReactDOM from 'react-dom';
import Carousel from './container/Carousel';


ReactDOM.render(
  <Carousel useDashboard={ true } useAutomaticLoop={ true }>
    <div>4</div>
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>1</div>
  </Carousel>,
  document.getElementById('root')
);
