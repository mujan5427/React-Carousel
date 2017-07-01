import React from 'react';
var Hammer = require('react-hammerjs');
// import Hammer from '../../../node_modules/react-hammerjs/dist/react-hammerjs.min';

class Carousel extends React.Component {
  constructor (props) {
    super(props);


    /* * * * * * * * * * * * *
     *                       *
     *     Constant Area     *
     *                       *
     * * * * * * * * * * * * */

    this.MOVE              = 2;
    this.END               = 4;
    this.SCREEN_WIDTH      = window.innerWidth;
    this.HALF_SCREEN_WIDTH = this.SCREEN_WIDTH / 2;


    /* * * * * * * * * * * * *
     *                       *
     *   Methods Bind Area   *
     *                       *
     * * * * * * * * * * * * */

    this.updateScreenWidth   = this.updateScreenWidth.bind(this);
    this.btnPrev             = this.btnPrev.bind(this);
    this.btnNext             = this.btnNext.bind(this);
    this.animationEndHandler = this.animationEndHandler.bind(this);
    this.PanHandler          = this.PanHandler.bind(this);
    this.rollbackCard        = this.rollbackCard.bind(this);

    window.addEventListener('resize', this.updateScreenWidth);

    /* * * * * * * * * * * * *
     *                       *
     *    Component State    *
     *                       *
     * * * * * * * * * * * * */

    this.state = {
      index        : 1,
      coordinate   : -this.SCREEN_WIDTH,
      useAnimation : true
    };
  }

  updateScreenWidth() {
    this.SCREEN_WIDTH      = window.innerWidth;
    this.HALF_SCREEN_WIDTH = this.SCREEN_WIDTH / 2;

    this.setState({
      index        : this.state.index,
      coordinate   : (-this.SCREEN_WIDTH * this.state.index),
      useAnimation : this.state.useAnimation
    });
  }

  // When card is in boundary then rollback to the right coordinate.
  rollbackCard() {
    if (this.state.index === 5) {
      this.setState({
        index        : 1,
        coordinate   : -this.SCREEN_WIDTH * 1,
        useAnimation : false
      });

    } else if (this.state.index === 0) {
      this.setState({
        index        : 4,
        coordinate   : -this.SCREEN_WIDTH * 4,
        useAnimation : false
      });

    }
  }

  animationEndHandler() {
    this.rollbackCard();
  }

  btnPrev() {
    if (this.state.index !== 0) {
      this.setState({
        index        : this.state.index - 1,
        coordinate   : (-this.SCREEN_WIDTH * (this.state.index - 1)),
        useAnimation : true
      });
    }
  }

  btnNext() {
    if (this.state.index !== 5) {
      this.setState({
        index        : this.state.index + 1,
        coordinate   : (-this.SCREEN_WIDTH * (this.state.index + 1)),
        useAnimation : true
      });
    }
  }

  PanHandler (event) {
    switch (event.eventType) {
      case this.END:
        if (event.velocityX <= -0.5) {
          this.btnNext();

        } else if (event.velocityX >= 0.5) {
          this.btnPrev();

        } else if (event.deltaX <= -this.HALF_SCREEN_WIDTH) {
          this.btnNext();

        } else if (event.deltaX >= this.HALF_SCREEN_WIDTH) {
          this.btnPrev();

        } else {
          this.setState({
            index        : this.state.index,
            coordinate   : (-this.SCREEN_WIDTH * this.state.index),
            useAnimation : true
          });
        }
        break;

      case this.MOVE:
        if (this.state.index === 5 || this.state.index === 0) {
          this.rollbackCard();

        } else {
          this.setState({
            index        : this.state.index,
            coordinate   : (-this.SCREEN_WIDTH * this.state.index) + event.deltaX,
            useAnimation : false
          });
        }
        break;

      default:
        break;
    }
  }

  render() {
    var animationArguments;

    if (this.state.useAnimation !== true) {
      animationArguments = {
        transform: `translate3d(${ this.state.coordinate.toString() }px, 0, 0)`,
        transition: 'none'
      };
    } else {

      animationArguments = {
        transform: `translate3d(${ this.state.coordinate.toString() }px, 0, 0)`
      };
    }

    return (
      <div style={ {'padding': '20px 0'} }>

        {/* Current State Information */}
        <div>{ this.state.index.toString() }</div>
        <div>{ this.state.coordinate.toString() }</div>
        <div>{ this.state.useAnimation.toString() }</div>

        {/* Card Panel */}
        <section className='carousel-window-panel'>
          <Hammer onPan={ this.PanHandler } onTransitionEnd={ this.animationEndHandler }>
            <div style={ animationArguments }>
              <div>4</div>
              <div>1</div>
              <div>2</div>
              <div>3</div>
              <div>4</div>
              <div>1</div>
            </div>
          </Hammer>
        </section>

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
