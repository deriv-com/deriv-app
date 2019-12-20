import classNames        from 'classnames';
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
        }
    }

    render() {
        if (!this.props.has_result) return null;

        if (!this.props.is_multiplier) {
            return (
                <div className='contract-audit__wrapper'>
                    <ContractDetails {...this.props} />
                </div>
            );
        }

        return (
            <div className={classNames('contract-audit__wrapper', {
                'contract-audit__wrapper-tabs--active' : !this.props.contract_info.is_sold,
                'contract-audit__wrapper-tabs--expired': this.props.contract_info.is_sold,
            })}
            >
                <Tabs top onTabItemClick={this.onClick} className='contract-audit__wrapper-tabs'>
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
