import classNames from 'classnames';
import React from 'react';
import { Popover, DesktopWrapper, Loading, MobileWrapper, ThemedScrollbars } from '@deriv/components';
import { formatMoney, isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import LoadErrorMessage from 'Components/load-error-message';
import FormBody from 'Components/form-body';
import Text from 'Components/text';
import TextContainer from 'Components/text-container';
import DemoMessage from 'Components/demo-message';
import { connect } from 'Stores/connect';
import Article from './article.jsx';

const makeTurnoverLimitRow = (currency, arr, title) => (
    <>
        {arr &&
            arr.map(item => (
                <Row key={item.name}>
                    <Td>
                        {title && `${title} - `}
                        {item.name}
                    </Td>
                    <Td>{formatMoney(currency, item.turnover_limit, true)}</Td>
                </Row>
            ))}
    </>
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

const ExtraInfo = ({ message, ...props }) => (
    <>
        <DesktopWrapper>
            <Popover
                alignment='top'
                classNameTargetIcon='account-limit-popover'
                classNameTarget='account-limit-popover-target'
                icon='info'
                message={message}
                {...props}
            />
        </DesktopWrapper>
        <MobileWrapper>
            <div className='account-limit-container__extra-info'>{message}</div>
        </MobileWrapper>
    </>
);

class AccountLimits extends React.Component {
    state = { is_loading: true };

    componentDidMount() {
        if (this.props.is_virtual) {
            this.setState({ is_loading: false });
        } else {
            this.props.onMount().then(this.setState({ is_loading: false }));
        }
    }

    componentDidUpdate() {
        if (!this.props.is_virtual && this.props.account_limits && this.state.is_loading) {
            this.setState({ is_loading: false });
        }
    }

    render() {
        if (this.props.is_switching) return <Loading />;
        if (this.props.is_virtual) return <DemoMessage />;

        const {
            api_initial_load_error,
            open_positions,
            account_balance,
            payout,
            market_specific,
            num_of_days_limit,
            remainder,
            withdrawal_since_inception_monetary,
        } = this.props.account_limits;

        if (api_initial_load_error) return <LoadErrorMessage error_message={api_initial_load_error} />;
        if (this.props.is_switching || this.state.is_loading)
            return <Loading is_fullscreen={false} className='account___intial-loader' />;

        const { commodities, forex, indices, synthetic_index } = { ...market_specific };
        const { currency, is_fully_authenticated } = this.props;
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
                                                    <span>{localize('Maximum number of open positions*')}</span>
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
                                    <Text size='small' color='grey'>
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
                                                    <span className='account-limit-container-title'>
                                                        {localize('Trading limits - Maximum daily turnover')}
                                                    </span>
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
                                        {forex_ordered &&
                                            makeTurnoverLimitRow(currency, forex_ordered, localize('Forex'))}
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
                                                <Td>
                                                    {formatMoney(currency, withdrawal_since_inception_monetary, true)}
                                                </Td>
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
                                        <Text>
                                            {localize(
                                                'Your account is fully authenticated and your withdrawal limits have been lifted.'
                                            )}
                                        </Text>
                                    ) : (
                                        <Text size='small' color='grey'>
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
    }
}

// AccountLimits.propTypes = {};

export default connect(({ client }) => ({
    is_fully_authenticated: client.is_fully_authenticated,
    account_limits: client.account_limits,
    is_virtual: client.is_virtual,
    is_switching: client.is_switching,
    currency: client.currency,
    onMount: client.getLimits,
}))(AccountLimits);
