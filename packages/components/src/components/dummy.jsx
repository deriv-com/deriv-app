import React, { Component } from 'react';

class Dummy extends Component {
	renderDummyElement = () => <div />
	render () {
	    return this.renderDummyElement();
	}
}

export default Dummy;
