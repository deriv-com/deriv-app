import React from 'react';
import 'Sass/app/modules/mt5-dashboard.scss';

class MT5Dashboard extends React.Component {
    render() {
        const { location } = this.props;

        return (
            <div className='mt5-dashboard'>
                Dashboard loads at { location.pathname }!
            </div>
        );
    }
}

export default MT5Dashboard;
