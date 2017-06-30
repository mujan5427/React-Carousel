import React from 'react';
var Hammer = require('react-hammerjs');
// import Hammer from '../../../node_modules/react-hammerjs/dist/react-hammerjs.min';

class Carousel extends React.Component {
  constructor (props) {
    super(props);

    this.DIRECTION_LEFT  = 2;
    this.DIRECTION_RIGHT = 4;

    this.MOVE = 2;
    this.END  = 4;

    this.btnPrev      = this.btnPrev.bind(this);
    this.btnNext      = this.btnNext.bind(this);
    this.animationEnd = this.animationEnd.bind(this);

    this.handlePan    = this.handlePan.bind(this);

    this.state = {
      index        : 1,

      // -500 was default width of card item
      location     : -500,
      useAnimation : true
    };
  }

  btnPrev() {
    if (this.state.index > 0) {
      this.setState({
        index        : this.state.index - 1,
        location     : (-500 * (this.state.index - 1)),
        useAnimation : true
      });
    }
  }

  btnNext() {
    if (this.state.index < 5) {
      this.setState({
        index        : this.state.index + 1,
        location     : (-500 * (this.state.index + 1)),
        useAnimation : true
      });
    }
  }

  animationEnd() {
    switch (this.state.index) {
      case 5:
        this.setState({
          index        : 1,
          location     : -500,
          useAnimation : false
        });
        break;

      case 0:
        this.setState({
          index        : 4,
          location     : -2000,
          useAnimation : false
        });
        break;

      default:
        break;
    }
  }

  handlePan (event) {
    switch (event.eventType) {
      case this.END:
        if (event.velocityX <= -0.5) {
          this.btnNext();

        } else if (event.velocityX >= 0.5) {
          this.btnPrev();

        } else if (event.deltaX <= -220) {
          this.btnNext();

        } else if (event.deltaX >= 220) {
          this.btnPrev();

        } else {
          this.setState({
            index        : this.state.index,
            location     : (-500 * this.state.index),
            useAnimation : true
          });
        }
        break;

      case this.MOVE:
        this.setState({
          index        : this.state.index,
          location     : (-500 * this.state.index) + event.deltaX,
          useAnimation : false
        });
        break;

      default:
        break;
    }
  }

  render() {
    var animationArguments;

    if (this.state.useAnimation !== true) {
      animationArguments = { transform: `translate3d(${ this.state.location.toString() }px, 0, 0)`,
                        transition: 'none'};
    } else {

      animationArguments = { transform: `translate3d(${ this.state.location.toString() }px, 0, 0)` };
    }

    return (
      <div style={ {'padding': '20px 0'} }>

        {/* Current State Information */}
        <div>{ this.state.index.toString() }</div>
        <div>{ this.state.location.toString() }</div>
        <div>{ this.state.useAnimation.toString() }</div>

        {/* Card Panel */}
        <Hammer onPan={ this.handlePan }>
          <section className='carousel-window-panel'>
            <div style={ animationArguments } onTransitionEnd={ this.animationEnd }>
              <div>4</div>
              <div>1</div>
              <div>2</div>
              <div>3</div>
              <div>4</div>
              <div>1</div>
            </div>
          </section>
        </Hammer>

        {/* DashBoard */}
        <section className='carousel-dashboard-panel'>
          <button onClick={ this.btnPrev }>prev</button>
          <button onClick={ this.btnNext }>next</button>
        </section>
      </div>
    );
  }
}

export default Carousel;