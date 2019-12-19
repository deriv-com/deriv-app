import PropTypes         from 'prop-types';
import React             from 'react';
import { Tabs }          from 'deriv-components';
import { localize }      from 'deriv-translations';
import ContractDetails   from './contract-details.jsx';
import ContractHistory   from './contract-history.jsx';

class ContractAudit extends React.PureComponent {
    onClick = (index) => {
        if (index) {
            // TODO: add history API call
            console.log('hello', index);
        }
    }

    render() {
        if (!this.props.has_result) return null;

        return (
            <div className='contract-audit__wrapper'>
                <Tabs top onTabItemClick={this.onClick}>
                    <div label={localize('Details')}>
                        <ContractDetails {...this.props} />
                    </div>
                    <div label={localize('History')}>
                        <ContractHistory currency={this.props.contract_info.currency} />
                    </div>
                </Tabs>
            </div>
        );
    }
}

ContractAudit.propTypes = {
    contract_end_time: PropTypes.PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    contract_info: PropTypes.object,
    duration     : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    duration_unit: PropTypes.string,
    exit_spot    : PropTypes.string,
};

export default ContractAudit;
