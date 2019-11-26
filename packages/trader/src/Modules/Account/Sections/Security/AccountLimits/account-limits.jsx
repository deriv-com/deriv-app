// import PropTypes      from 'prop-types';
import classNames             from 'classnames';
import React                  from 'react';
import { Popover }            from 'deriv-components';
import CurrencyUtils          from 'deriv-shared/utils/currency';
import { connect }            from 'Stores/connect';
import { localize, Localize } from 'deriv-translations';
import { WS }                 from 'Services/ws-methods';
import Loading                from '../../../../../templates/app/components/loading.jsx';
import {
    ScrollbarsContainer,
    TextContainer,
    Text }                    from '../../../Components/layout-components.jsx';
import DemoMessage            from '../../ErrorMessages/DemoMessage';
import LoadErrorMessage       from '../../ErrorMessages/LoadErrorMessage';

const makeTurnoverLimitRow = (currency, arr, title) => (
    <>
        { arr &&
            arr.map(item =>
                <Row key={item.name}>
                    <Td>{title && `${title} - `}{item.name}</Td>
                    <Td>{CurrencyUtils.formatMoney(currency, item.turnover_limit, true)}</Td>
                </Row>
            )
        }
    </>
);

const TableHeader = ({ children, is_flex }) => (
    <th
        className={classNames({ 'account-management-flex-wrapper': is_flex })}
    >{children}
    </th>
);

const Row = ({ children }) => (
    <tr className='account-management-flex-wrapper account-management-flex-wrapper--space-between'>
        {children}
    </tr>
);

const Td = ({ children, is_flex }) => (
    <td
        className={classNames('account__text', {
            'account-management-flex-wrapper': is_flex,
        })}
    >
        {children}
    </td>
);

class AccountLimits extends React.Component {
    state = { is_loading: true }

    componentDidMount() {
        if (this.props.is_virtual) {
            this.setState({ is_loading: false });
        } else {
            WS.authorized.storage.getLimits().then((data) => {
                if (data.error) {
                    this.setState({ api_initial_load_error: data.error.message });
                    return;
                }
                this.setState({ ...data.get_limits, is_loading: false });
            });
        }
    }

    render() {
        if (this.props.is_virtual) return <DemoMessage />;
        const {
            api_initial_load_error,
            is_loading,
            open_positions,
            account_balance,
            payout,
            market_specific,
            num_of_days_limit,
            remainder,
            withdrawal_since_inception_monetary } = this.state;

        if (api_initial_load_error) return <LoadErrorMessage error_message={api_initial_load_error} />;
        if (is_loading) return <Loading is_fullscreen={false} className='account___intial-loader' />;

        const { commodities, forex, indices, synthetic_index  } = market_specific;
        const { currency, is_fully_authenticated } = this.props;

        return (
            <section className='account-limit-container'>
                <ScrollbarsContainer>
                    <Text className='account-limit-container__main-text'>
                        <Localize
                            i18n_default_text='These are default limits that we apply to your accounts. To learn more about trading limits and how they apply, please go to the <0>Help Centre</0>.'
                            components={[
                                <a key={0} className='link link--orange' rel='noopener noreferrer' target='_blank' href='https://www.deriv.com/help-centre/' />,
                            ]}
                        />
                    </Text>
                    <table className='account-management-table'>
                        <thead>
                            <Row>
                                <TableHeader>{localize('Trading limits - Item')}</TableHeader>
                                <TableHeader>{localize('Limit')}</TableHeader>
                            </Row>
                            <tr className='account-management-table__divider'>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            <Row>
                                <Td is_flex>
                                    {localize('Maximum number of open positions')}
                                    <Popover
                                        alignment='top'
                                        classNameTargetIcon='account-limit-popover'
                                        classNameTarget='account-limit-popover-target'
                                        icon='info'
                                        message={localize('Represents the maximum number of outstanding contracts in your portfolio. Each line in your portfolio counts for one open position. Once the maximum is reached, you will not be able to open new positions without closing an existing position first.')}
                                    />
                                </Td>
                                <Td>{ open_positions }</Td>
                            </Row>
                            <Row>
                                <Td is_flex>
                                    {localize('Maximum account cash balance')}
                                    <Popover
                                        alignment='top'
                                        classNameTargetIcon='account-limit-popover'
                                        classNameTarget='account-limit-popover-target'
                                        icon='info'
                                        message={localize('Represents the maximum amount of cash that you may hold in your account.  If the maximum is reached, you will be asked to withdraw funds.')}
                                    />
                                </Td>
                                <Td>{ CurrencyUtils.formatMoney(currency, account_balance, true) }</Td>
                            </Row>
                            <Row>
                                <Td is_flex>
                                    {localize('Maximum aggregate payouts on open positions')}
                                    <Popover
                                        alignment='top'
                                        classNameTargetIcon='account-limit-popover'
                                        classNameTarget='account-limit-popover-target'
                                        icon='info'
                                        message={localize('Represents the maximum aggregate payouts on outstanding contracts in your portfolio. If the maximum is attained, you may not purchase additional contracts without first closing out existing positions.')}
                                    />
                                </Td>
                                <Td>{ CurrencyUtils.formatMoney(currency, payout, true) }</Td>
                            </Row>
                        </tbody>
                    </table>
                    <TextContainer>
                        <Text size='small' color='grey'>{localize('*Any limits in your Self-exclusion settings will override these default limits.')}</Text>
                    </TextContainer>
                    <table className='account-management-table'>
                        <thead>
                            <Row>
                                <TableHeader is_flex>
                                    {localize('Trading limits - Maximum daily turnover')}
                                    <Popover
                                        alignment='top'
                                        classNameTargetIcon='account-limit-popover'
                                        classNameTarget='account-limit-popover-target'
                                        icon='info'
                                        message={localize('Represents the maximum volume of contracts that you may purchase in any given trading day.')}
                                        margin={0}
                                    />
                                </TableHeader>
                                <TableHeader>{localize('Limit')}</TableHeader>
                            </Row>
                            <tr className='account-management-table__divider'>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            { makeTurnoverLimitRow(currency, commodities) }
                            { makeTurnoverLimitRow(currency, forex, localize('Forex')) }
                            { makeTurnoverLimitRow(currency, indices) }
                            { makeTurnoverLimitRow(currency, synthetic_index) }
                        </tbody>
                    </table>
                    <table className='account-management-table account-management-table--last'>
                        <thead>
                            <Row>
                                <TableHeader>{localize('Withdrawal limits')}</TableHeader>
                                {!is_fully_authenticated && <TableHeader>{localize('Limit')}</TableHeader>}
                            </Row>
                            <tr className='account-management-table__divider'>
                                <th />
                            </tr>
                        </thead>
                        {!is_fully_authenticated &&
                            <tbody>
                                <Row>
                                    <Td>{localize('Total withdrawal allowed')}</Td>
                                    <Td>{CurrencyUtils.formatMoney(currency, num_of_days_limit, true)}</Td>
                                </Row>
                                <Row>
                                    <Td>{localize('Total withdrawn')}</Td>
                                    <Td>
                                        {CurrencyUtils.formatMoney(currency, withdrawal_since_inception_monetary, true)}
                                    </Td>
                                </Row>
                                <Row>
                                    <Td>{localize('Maximum withdrawal remaining')}</Td>
                                    <Td>{CurrencyUtils.formatMoney(currency, remainder, true)}</Td>
                                </Row>
                            </tbody>
                        }
                    </table>
                    {!is_fully_authenticated ?
                        <TextContainer>
                            <Text size='small' color='grey'>{localize('Stated limits are subject to change without prior notice.')}</Text>
                        </TextContainer>
                        :
                        <TextContainer>
                            <Text>{localize('Your account is fully authenticated and your withdrawal limits have been lifted.')}</Text>
                        </TextContainer>
                    }
                </ScrollbarsContainer>
            </section>
        );
    }
}

// AccountLimits.propTypes = {};

export default connect(
    ({ client }) => ({
        is_fully_authenticated: client.is_fully_authenticated,
        is_virtual            : client.is_virtual,
        currency              : client.currency,
    }),
)(AccountLimits);
