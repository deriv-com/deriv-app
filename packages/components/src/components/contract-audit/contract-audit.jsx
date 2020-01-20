import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import ContractAuditItem   from './contract-audit-item.jsx';
import ContractAuditLoader from './contract-audit-loader.jsx';
import ThemedScrollbars    from '../themed-scrollbars';

const ContractAudit = ({
    should_add_scrollbars,
    is_contract_sellable,
    children,
}) => (
    <div className={classNames(
        'contract-audit__wrapper',
        {
            'contract-audit__wrapper--scrollbars': should_add_scrollbars,
            'contract-audit__wrapper--sellable'  : should_add_scrollbars && is_contract_sellable,
        }
    )}
    >
        { should_add_scrollbars ?
            <ThemedScrollbars
                // style={{ width: '100%', height: '100%' }}
                autohide
            >
                { children }
            </ThemedScrollbars>
            :
            <React.Fragment>
                { children }
            </React.Fragment>
        }
    </div>
);

ContractAudit.propTypes = {
    is_contract_sellable : PropTypes.bool,
    should_add_scrollbars: PropTypes.bool,
};

ContractAudit.Item   = ContractAuditItem;
ContractAudit.Loader = ContractAuditLoader;

export default ContractAudit;
