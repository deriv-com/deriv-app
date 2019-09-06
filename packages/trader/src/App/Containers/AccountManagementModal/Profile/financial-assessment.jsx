// import PropTypes        from 'prop-types';
import React            from 'react';
import { WS }           from 'Services';
import {
    Autocomplete,
    Button,
    Checkbox,
    Input,
    Form,
}                       from 'deriv-components';

class FinancialAssessment extends React.Component {
    render() {
        return (
            <div></div>
        );
    }
    componentDidMount() {
        WS.getFinancialAssessment().then((data) => {
            console.log(data);
        })
    }
}

// FinancialAssessment.propTypes = {};

export default FinancialAssessment
