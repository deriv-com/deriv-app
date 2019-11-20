import React from 'react';

class Payment extends React.Component {
    state = { greet: 'hi' }
    render() {
        return <div>{this.state.greet}</div>;
    }
}
 
export default Payment;
