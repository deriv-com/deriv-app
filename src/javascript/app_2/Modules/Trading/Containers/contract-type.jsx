import PropTypes          from 'prop-types';
import React              from 'react';
import { connect }        from 'Stores/connect';
import ContractTypeWidget from '../Components/Form/ContractType/contract-type-widget.jsx';

const Contract = ({
    contract_type,
    contract_types_list,
    is_dark_theme,
    is_equal,
    is_mobile,
    onChange,
}) => (
    <ContractTypeWidget
        is_dark_theme={is_dark_theme}
        is_equal={is_equal}
        is_mobile={is_mobile}
        list={contract_types_list}
        name='contract_type'
        onChange={onChange}
        value={contract_type}
    />
);

Contract.propTypes = {
    contract_type      : PropTypes.string,
    contract_types_list: PropTypes.object,
    is_equal           : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    is_mobile: PropTypes.bool,
    onChange : PropTypes.func,
};

export default connect(
    ({ modules, ui }) => ({
        contract_type      : modules.trade.contract_type,
        contract_types_list: modules.trade.contract_types_list,
        is_equal           : modules.trade.is_equal,
        onChange           : modules.trade.onChange,
        is_dark_theme      : ui.is_dark_mode_on,
        is_mobile          : ui.is_mobile,
    })
)(Contract);
