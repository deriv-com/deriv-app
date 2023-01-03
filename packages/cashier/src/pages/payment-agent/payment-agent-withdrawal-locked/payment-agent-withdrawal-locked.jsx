import React from 'react';
import PropTypes from 'prop-types';
import { Button, StaticUrl, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { routes } from '@deriv/shared';
import { withRouter } from 'react-router-dom';
import Error from 'Components/error';
import './payment-agent-withdrawal-locked.scss';

const PaymentAgentWithdrawalLockedItem = ({ item }) => {
    return (
        <div className='cashier__wrapper--align-center payment-agent-withdrawal-locked'>
            {item.title && (
                <Text align='center' as='p' className='payment-agent-withdrawal-locked__title' line_height='s' size='s'>
                    {item.title}
                </Text>
            )}
            <Text align='center' as='p' className='payment-agent-withdrawal-locked__text' line_height='s' size='xs'>
                {item.content}
            </Text>
            <Button
                className='payment-agent-withdrawal-locked__btn-confirm'
                onClick={item.onConfirm}
                primary
                large
                type='button'
            >
                <Localize i18n_default_text={item.btn_confirm_text} />
            </Button>
        </div>
    );
};

const PaymentAgentWithdrawalLocked = ({ error, history }) => {
    const items = [
        ...(error.code === 'PaymentAgentWithdrawSameMethod'
            ? [
                  {
                      btn_confirm_text: localize('OK'),
                      content: localize(
                          'To withdraw your funds, please choose the same payment method you used to make your deposits.'
                      ),
                      onConfirm: () => history.push(routes.cashier_withdrawal),
                  },
              ]
            : []),
        ...(error.code === 'PaymentAgentUseOtherMethod'
            ? [
                  {
                      btn_confirm_text: localize('OK'),
                      content: (
                          <Localize
                              i18n_default_text='Please use an e-wallet that you have used for deposits previously. Ensure the e-wallet supports withdrawal. See the list of e-wallets that support withdrawals <0>here</0>.'
                              components={[<StaticUrl key={0} className='link' href='/payment-methods' />]}
                          />
                      ),
                      onConfirm: () => history.push(routes.cashier_withdrawal),
                      title: localize('Please use an e-wallet to withdraw your funds.'),
                  },
              ]
            : []),
    ];

    if (
        error.onClickButton ||
        error.code !== 'PaymentAgentWithdrawSameMethod' ||
        error.code !== 'PaymentAgentUseOtherMethod'
    ) {
        return <Error error={error} />;
    }

    return (
        <React.Fragment>
            {items.map((item, index) => {
                return <PaymentAgentWithdrawalLockedItem item={item} key={index} />;
            })}
        </React.Fragment>
    );
};

PaymentAgentWithdrawalLocked.propTypes = {
    error: PropTypes.object,
    history: PropTypes.object,
};

PaymentAgentWithdrawalLockedItem.propTypes = {
    item: PropTypes.object,
};

export default withRouter(PaymentAgentWithdrawalLocked);
