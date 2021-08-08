import PropTypes from 'prop-types';
import React from 'react';
import { DataList, Icon, Loading, MobileWrapper, Table, Text } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import CryptoTransactionsCancelModal from './crypto-transactions-cancel-modal.jsx';
import CryptoTransactionsStatusModal from './crypto-transactions-status-modal.jsx';
import CryptoTransactionsRenderer from './crypto-transactions-renderer.jsx';

const getHeaders = () => [
    { text: localize('Transaction') },
    { text: localize('Amount') },
    { text: localize('Address') },
    { text: localize('Transaction hash') },
    { text: localize('Date & time') },
    { text: localize('Status') },
    { text: localize('Action') },
];

const CryptoTransactionsHistory = ({
    crypto_transactions,
    currency,
    is_loading,
    onMount,
    setIsCryptoTransactionsVisible,
}) => {
    React.useEffect(() => {
        onMount();
    }, [onMount]);

    const onClickBack = () => {
        setIsCryptoTransactionsVisible(false); 
    };

    const getRowGap = () => {
        if(isMobile()){
            return '8';
        }
        return '0';
    };

    return (
        <React.Fragment>
            <div className='crypto-transactions-history'>
                <div className='crypto-transactions-history__header'>
                    <div className='crypto-transactions-history__back' onClick={onClickBack}>
                        <Icon icon={isMobile() ? 'IcChevronLeftBold' : 'IcArrowLeftBold'} />
                        <Text as='p' size='xs' weight='bold'>
                            <Localize i18n_default_text={` ${currency} transactions history`} />
                        </Text>
                    </div>
                </div>
                <MobileWrapper>
                    <CryptoTransactionsCancelModal /> 
                    <CryptoTransactionsStatusModal />
                </MobileWrapper>
                <Table 
                    className='crypto-transactions-history__table'
                >
                    {isDesktop() && <Table.Header className='crypto-transactions-history__table-header'>
                            <Table.Row className='crypto-transactions-history__table-row'>
                                {getHeaders().map(header => (
                                    <Table.Head key={header.text}>{header.text}</Table.Head>
                                ))}
                            </Table.Row>
                        </Table.Header>
                    }
                    <Table.Body className='crypto-transactions-history__table-body'>
                        { is_loading ? <Loading is_fullscreen={false} /> :
                            <DataList
                                data_list_className='crypto-transactions-history__data-list'
                                data_source={crypto_transactions}
                                rowRenderer={row_props => <CryptoTransactionsRenderer {...row_props} />}
                                keyMapper={row => row.id}
                                row_gap = {getRowGap}
                            /> 
                        }
                    </Table.Body>
                </Table>
            </div>
        </React.Fragment>
    );
};

CryptoTransactionsHistory.propTypes = {
    crypto_transactions: PropTypes.array,
    currency: PropTypes.string,
    is_loading: PropTypes.bool,
    onMount: PropTypes.func,
    setIsCryptoTransactionsVisible: PropTypes.func,
};

export default connect(({ client, modules }) => ({
    crypto_transactions: modules.cashier.transaction_history.crypto_transactions,
    currency: client.currency,
    is_loading: modules.cashier.transaction_history.is_loading,
    onMount: modules.cashier.transaction_history.onMountCryptoTransactionsHistory,
    setIsCryptoTransactionsVisible: modules.cashier.transaction_history.setIsCryptoTransactionsVisible,
}))(CryptoTransactionsHistory);
