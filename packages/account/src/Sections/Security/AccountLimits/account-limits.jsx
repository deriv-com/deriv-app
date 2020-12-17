import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Popover, DesktopWrapper, Loading, MobileWrapper, ThemedScrollbars, Text } from '@deriv/components';
import { formatMoney, isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import LoadErrorMessage from 'Components/load-error-message';
import FormBody from 'Components/form-body';
import TextContainer from 'Components/text-container';
import DemoMessage from 'Components/demo-message';
import { connect } from 'Stores/connect';
import Article from './article.jsx';

const makeTurnoverLimitRow = (currency, arr, title) => (
    <React.Fragment>
        {arr?.map(item => (
            <Row key={item.name}>
                <Td>
                    {title && `${title} - `}
                    {item.name}
                </Td>
                <Td>{formatMoney(currency, item.turnover_limit, true)}</Td>
            </Row>
        ))}
    </React.Fragment>
);

const TableHeader = ({ children, is_flex }) => (
    <th className={classNames({ 'account-management-flex-wrapper': is_flex })}>{children}</th>
);

const Row = ({ children }) => <tr>{children}</tr>;

const Td = ({ children, is_flex }) => (
    <td
        className={classNames('account__text', {
            'account-management-flex-wrapper': is_flex,
        })}
    >
        {children}
    </td>
);

const ExtraInfo = ({ message, ...props }) => {
    const header_height = 48;
    const toolbar_height = 56;

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Popover
                    alignment='right'
                    classNameTargetIcon='account-limit-popover'
                    classNameTarget='account-limit-popover-target'
                    icon='info'
                    message={message}
                    window_border={header_height + toolbar_height}
                    {...props}
                />
            </DesktopWrapper>
            <MobileWrapper>
                <div className='account-limit-container__extra-info'>{message}</div>
            </MobileWrapper>
        </React.Fragment>
    );
};

const AccountLimits = ({ account_limits, currency, getLimits, is_fully_authenticated, is_switching, is_virtual }) => {
    const [is_loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (is_virtual) setLoading(false);
        else getLimits().then(setLoading(false));
    }, []);

    React.useEffect(() => {
        if (!is_virtual && account_limits && is_loading) setLoading(false);
    }, [account_limits, is_virtual, is_loading]);

    if (is_switching) return <Loading />;
    if (is_virtual) return <DemoMessage />;

    const {
        api_initial_load_error,
        open_positions,
        account_balance,
        payout,
        market_specific,
        num_of_days_limit,
        remainder,
        withdrawal_since_inception_monetary,
    } = account_limits;

    if (api_initial_load_error) return <LoadErrorMessage error_message={api_initial_load_error} />;
    if (is_switching || is_loading) return <Loading is_fullscreen={false} className='account__initial-loader' />;

    const { commodities, forex, indices, synthetic_index } = { ...market_specific };
    const forex_ordered = forex?.sort?.((a, b) => (a.name < b.name ? 1 : -1));
    if (forex_ordered && forex_ordered.push) {
        forex_ordered.push(forex_ordered.shift());
    }

    return (
        <section className='account-limit-container'>
            <div className='account-limit-container__wrapper'>
                <ThemedScrollbars is_bypassed={isMobile()} className='account-limit-container__scrollbars'>
                    <MobileWrapper>
                        <Article />
                    </MobileWrapper>
                    <FormBody scroll_offset={isMobile() ? '0' : null}>
                        <div className='account-limit-container__content'>
                            <table className='account-management-table'>
                                <thead>
                                    <Row>
                                        <TableHeader>{localize('Trading limits - Item')}</TableHeader>
                                        <TableHeader>{localize('Limit')}</TableHeader>
                                    </Row>
                                </thead>
                                <tbody>
                                    <Row>
                                        <Td>
                                            <div className='account-management-flex-wrapper'>
                                                {localize('Maximum number of open positions*')}
                                                <ExtraInfo
                                                    message={localize(
                                                        'Represents the maximum number of outstanding contracts in your portfolio. Each line in your portfolio counts for one open position. Once the maximum is reached, you will not be able to open new positions without closing an existing position first.'
                                                    )}
                                                />
                                            </div>
                                        </Td>
                                        <Td>{open_positions}</Td>
                                    </Row>
                                    <Row>
                                        <Td>
                                            <div className='account-management-flex-wrapper'>
                                                {localize('Maximum account cash balance*')}
                                                <ExtraInfo
                                                    message={localize(
                                                        'Represents the maximum amount of cash that you may hold in your account.  If the maximum is reached, you will be asked to withdraw funds.'
                                                    )}
                                                />
                                            </div>
                                        </Td>
                                        <Td>{formatMoney(currency, account_balance, true)}</Td>
                                    </Row>
                                    <Row>
                                        <Td>
                                            <div className='account-management-flex-wrapper'>
                                                {localize('Maximum aggregate payouts on open positions')}
                                                <ExtraInfo
                                                    message={localize(
                                                        'Represents the maximum aggregate payouts on outstanding contracts in your portfolio. If the maximum is attained, you may not purchase additional contracts without first closing out existing positions.'
                                                    )}
                                                />
                                            </div>
                                        </Td>
                                        <Td>{formatMoney(currency, payout, true)}</Td>
                                    </Row>
                                </tbody>
                            </table>
                            <TextContainer>
                                <Text as='p' size='xxs' color='less-prominent' line_height='xs'>
                                    {localize(
                                        '*Any limits in your Self-exclusion settings will override these default limits.'
                                    )}
                                </Text>
                            </TextContainer>
                            <table className='account-management-table'>
                                <thead>
                                    <Row>
                                        <TableHeader>
                                            <div className='account-management-flex-wrapper'>
                                                <Text
                                                    size={isMobile() ? 'xxs' : 'x'}
                                                    weight='bold'
                                                    className='account-limit-container-title'
                                                >
                                                    {localize('Trading limits - Maximum daily turnover')}
                                                </Text>
                                                <ExtraInfo
                                                    message={localize(
                                                        'Represents the maximum volume of contracts that you may purchase in any given trading day.'
                                                    )}
                                                    margin={0}
                                                />
                                            </div>
                                        </TableHeader>
                                        <TableHeader>{localize('Limit')}</TableHeader>
                                    </Row>
                                </thead>
                                <tbody>
                                    {commodities && makeTurnoverLimitRow(currency, commodities)}
                                    {forex_ordered && makeTurnoverLimitRow(currency, forex_ordered, localize('Forex'))}
                                    {indices && makeTurnoverLimitRow(currency, indices)}
                                    {synthetic_index && makeTurnoverLimitRow(currency, synthetic_index)}
                                </tbody>
                            </table>
                            <table className='account-management-table'>
                                <thead>
                                    <Row>
                                        <TableHeader>{localize('Withdrawal limits')}</TableHeader>
                                        {!is_fully_authenticated && <TableHeader>{localize('Limit')}</TableHeader>}
                                    </Row>
                                </thead>
                                {!is_fully_authenticated && (
                                    <tbody>
                                        <Row>
                                            <Td>{localize('Total withdrawal allowed')}</Td>
                                            <Td>{formatMoney(currency, num_of_days_limit, true)}</Td>
                                        </Row>
                                        <Row>
                                            <Td>{localize('Total withdrawn')}</Td>
                                            <Td>{formatMoney(currency, withdrawal_since_inception_monetary, true)}</Td>
                                        </Row>
                                        <Row>
                                            <Td>{localize('Maximum withdrawal remaining')}</Td>
                                            <Td>{formatMoney(currency, remainder, true)}</Td>
                                        </Row>
                                    </tbody>
                                )}
                            </table>
                            <TextContainer>
                                {is_fully_authenticated ? (
                                    <Text as='p' size='xxs' color='less-prominent' line_height='xs'>
                                        {localize(
                                            'Your account is fully authenticated and your withdrawal limits have been lifted.'
                                        )}
                                    </Text>
                                ) : (
                                    <Text as='p' size='xxs' color='less-prominent' line_height='xs'>
                                        {localize('Stated limits are subject to change without prior notice.')}
                                    </Text>
                                )}
                            </TextContainer>
                        </div>
                    </FormBody>
                </ThemedScrollbars>
                <DesktopWrapper>
                    <Article />
                </DesktopWrapper>
            </div>
        </section>
    );
};

AccountLimits.propTypes = {
    account_limits: PropTypes.object,
    currency: PropTypes.string,
    getLimits: PropTypes.func,
    is_fully_authenticated: PropTypes.bool,
    is_virtual: PropTypes.bool,
    is_switching: PropTypes.bool,
};

export default connect(({ client }) => ({
    account_limits: client.account_limits,
    currency: client.currency,
    getLimits: client.getLimits,
    is_fully_authenticated: client.is_fully_authenticated,
    is_virtual: client.is_virtual,
    is_switching: client.is_switching,
}))(AccountLimits);
