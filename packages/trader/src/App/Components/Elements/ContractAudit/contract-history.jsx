import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Money, ThemedScrollbars, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';

import { localize } from '@deriv/translations';
import ContractAuditItem from './contract-audit-item.jsx';

const ContractHistory = ({ currency, history = [] }) => {
    if (!history.length) {
        return (
            <div className='contract-audit__empty'>
                <Icon icon='IcBox' size={48} color='secondary' />
                <h4 className='contract-audit__empty-header'>{localize('No history')}</h4>
                <Text align='center' line_height='s' color='less-prominent' size='xxs'>
                    {localize('You have yet to update either take profit or stop loss')}
                </Text>
            </div>
        );
    }
    return (
        <ThemedScrollbars is_bypassed={isMobile()}>
            <div className='contract-audit__tabs-content'>
                {history.map((item, key) => (
                    <ContractAuditItem
                        key={key}
                        id={`dt_history_label_${key}`}
                        label={item.display_name}
                        timestamp={+item.order_date}
                        value={
                            Math.abs(+item.order_amount) !== 0 ? (
                                <React.Fragment>
                                    {+item.order_amount < 0 && <strong>-</strong>}
                                    <Money amount={item.order_amount} currency={currency} />
                                    {item.value && (
                                        <React.Fragment>
                                            <br />
                                            <span>({item.value})</span>
                                        </React.Fragment>
                                    )}
                                </React.Fragment>
                            ) : (
                                localize('Cancelled')
                            )
                        }
                    />
                ))}
            </div>
        </ThemedScrollbars>
    );
};

ContractHistory.propTypes = {
    currency: PropTypes.string,
    history: PropTypes.array,
};

export default ContractHistory;
