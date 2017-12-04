import React, {Component} from 'react'
import p5 from 'p5'
import {sketch} from './sketch'


export class Art extends Component {
  componentDidMount() {
    this.canvas = new p5(sketch, this.refs.wrapper)
  }

  componentWillReceiveProps(props, newprops) {
    if (this.canvas.redrawWithProps) {
      this.canvas.redrawWithProps(newprops)
    }
  }

  render() {
    return <div ref="wrapper"></div>
  }
}
