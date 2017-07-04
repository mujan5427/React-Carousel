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
    this.INTERVAL          = 2000;


    /* * * * * * * * * * * * *
     *                       *
     *   Methods Bind Area   *
     *                       *
     * * * * * * * * * * * * */

    this.btnPrev             = this.btnPrev.bind(this);
    this.btnNext             = this.btnNext.bind(this);
    this.animationEndHandler = this.animationEndHandler.bind(this);
    this.PanHandler          = this.PanHandler.bind(this);

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


  /* * * * * * * * * * * * *
   *                       *
   *  Component Lifecycle  *
   *                       *
   * * * * * * * * * * * * */

  componentDidMount() {
    this.startCarouselTimer();
  }

  componentWillUnmount() {
    this.stopCarouselTimer();
  }


  /* * * * * * * * * * * * *
   *                       *
   *        Methods        *
   *                       *
   * * * * * * * * * * * * */

  startCarouselTimer() {
    this.carouselTimer = setInterval(this.btnNext, this.INTERVAL);
  }

  stopCarouselTimer() {
    clearInterval(this.carouselTimer);
    this.carouselTimer = 0;
  }

  restartCarouselTimer(callback) {
    if (this.carouselTimer === 0) {
      callback();
      this.startCarouselTimer();

    } else {
      callback();

    }
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

  calculateIndexPickerList() {
    var start = 1;
    var end   = 4;
    var indexPickerList  = [];

    if (end !== 0) {
      for (start; start <= end; start++) {

        indexPickerList[start - 1] =
        <span
          className={ this.state.index === start ? 'carousel-index-picker-active' : null }
          key={ start }
          onClick={ this.moveToSpecifiedIndex.bind(this, start) }
        ></span>;
      }

    } else {
      indexPickerList = false;

    }

    return indexPickerList;
  }

  moveToSpecifiedIndex(specifiedIndex) {
    if (this.carouselTimer !== 0) {
      this.stopCarouselTimer();
    }

    this.setState({
      index        : specifiedIndex,
      coordinate   : (-this.SCREEN_WIDTH * specifiedIndex),
      useAnimation : true
    });
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

        <Hammer onPan={ this.PanHandler } onTransitionEnd={ this.animationEndHandler }>

          {/* Card Panel */}
          <section className='carousel-window-panel'>

            {/* Card Display Area */}
            <div style={ animationArguments }>
              <div>4</div>
              <div>1</div>
              <div>2</div>
              <div>3</div>
              <div>4</div>
              <div>1</div>
            </div>

            {/* DashBoard */}
            <div
              className='carousel-dashboard carousel-button-prev'
              onClick={ this.restartCarouselTimer.bind(this, this.btnPrev) }
            >
              <i className='fa fa-angle-left' aria-hidden='true'></i>
            </div>

            <div
              className='carousel-dashboard carousel-button-next'
              onClick={ this.restartCarouselTimer.bind(this, this.btnNext) }
            >
              <i className='fa fa-angle-right' aria-hidden='true'></i>
            </div>

            {/* Index Picker List */}
            <div>
              { this.calculateIndexPickerList() }
            </div>
          </section>
        </Hammer>
      </div>
    );
  }
}

export default Carousel;
