// import PropTypes        from 'prop-types';
import React            from 'react';
import { localize }     from 'App/i18n';
import { WS }           from 'Services';
import Loading          from '../../../../templates/app/components/loading.jsx';
import { addCommaToNumber } from '../../../Components/Elements/PositionsDrawer/helpers/positions-helper';
import { Popover }     from 'deriv-components';
import { Table, TableHead, TableHeader, TableBody, Row, TextContainer, Text, Td } from '../Components/layout-components';

const display_decimals = 2;
const makeTurnoverLimitRow = arr => (
    <>
        { arr &&
            arr.map(item => 
                <Row key={item.name}>
                    <Td>{item.name}</Td>
                    <Td>{addCommaToNumber(item.turnover_limit, display_decimals)}</Td>
                </Row>    
            )
        }
    </>
);

class AccountLimits extends React.Component {
    state = { is_loading: true }

    componentDidMount() {
        WS.getAccountLimits().then((data) => {
            this.setState({ ...data.get_limits, is_loading: false });
        });
    }

    render() {
        const { 
            is_loading,
            open_positions,
            account_balance,
            payout,
            market_specific,
            num_of_days_limit,
            remainder,
            withdrawal_since_inception_monetary } = this.state;

        if (is_loading) return <Loading />

        const { commodities, forex, indices, volidx } = market_specific;

        return (
            <section className='account-limit-container'>
                <Text className='account-limit-container__main-text'>
                    These are default limits that we apply to your accounts. To learn more about trading limits and how they apply, please go to the Help Centre.
                </Text>
                <Table>
                    <TableHead>
                        <Row>
                            <TableHeader>{localize('Trading limits - item')}</TableHeader>
                            <TableHeader>{localize('Limit')}</TableHeader>
                        </Row>
                        <tr>
                            <th/>
                        </tr>
                    </TableHead>
                    <TableBody>
                        <Row>
                            <Td is_flex>
                                {localize('*Maximum number of open positions')}
                                <Popover
                                    alignment='top'
                                    classNameTargetIcon='account-limit-popover'
                                    classNameTarget='account-limit-popover-target'
                                    icon='info'
                                    message={localize('Represents the maximum number of outstanding contracts in your portfolio. Each line in your portfolio counts for one open position. Once the maximum is reached, you will not be able to open new positions without closing an existing position first.')}
                                    portal_container='modal_root'
                                />
                            </Td>
                            <Td>{ addCommaToNumber(open_positions, 0) }</Td>
                        </Row>
                        <Row>
                            <Td is_flex>
                                {localize('*Maximum account cash balance')}
                                <Popover
                                    alignment='top'
                                    classNameTargetIcon='account-limit-popover'
                                    classNameTarget='account-limit-popover-target'
                                    icon='info'
                                    message={localize('Represents the maximum amount of cash that you may hold in your account.  If the maximum is reached, you will be asked to withdraw funds.')}
                                    portal_container='modal_root'
                                />
                            </Td>
                            <Td>{ addCommaToNumber(account_balance, display_decimals) }</Td>
                        </Row>
                        <Row>
                            <Td is_flex>
                                {localize('Maximum aggregate payouts on open positions')}
                                <Popover
                                    alignment='top'
                                    classNameTargetIcon='account-limit-popover'
                                    classNameTarget='account-limit-popover-target'
                                    icon='info'
                                    message={localize('Presents the maximum aggregate payouts on outstanding contracts in your portfolio. If the maximum is attained, you may not purchase additional contracts without first closing out existing positions.')}
                                    portal_container='modal_root'
                                />
                            </Td>
                            <Td>{ addCommaToNumber(payout, display_decimals) }</Td>
                        </Row>
                    </TableBody>
                </Table>
                <TextContainer>
                    <Text size='xsmall'>{localize('*Any limits in your Self-exclusion settings will override these default limits.')}</Text>
                </TextContainer>
                <Table>
                    <TableHead>
                        <Row>
                            <TableHeader is_flex>
                                {localize('Trading limits - Maximum daily turnover')}
                                <Popover
                                    alignment='top'
                                    classNameTargetIcon='account-limit-popover'
                                    classNameTarget='account-limit-popover-target'
                                    icon='info'
                                    message={localize('Presents the maximum aggregate payouts on outstanding contracts in your portfolio. If the maximum is attained, you may not purchase additional contracts without first closing out existing positions.')}
                                    margin={0}
                                    portal_container='modal_root'
                                />
                            </TableHeader>
                            <TableHeader>{localize('Limit')}</TableHeader>
                        </Row>
                    </TableHead>
                    <TableBody>
                        { makeTurnoverLimitRow(commodities) }
                        { makeTurnoverLimitRow(forex) }
                        { makeTurnoverLimitRow(indices) }
                        { makeTurnoverLimitRow(volidx) }
                    </TableBody>
                </Table>
                <Table className='account-limit-container__withdrawal-table'>
                    <TableHead>
                        <Row>
                            <TableHeader>{localize('Withdrawal limits')}</TableHeader>
                            <TableHeader>{localize('Limit')}</TableHeader>
                        </Row>
                    </TableHead>
                    <TableBody>
                        <Row>
                            <Td>{localize('Total withdrawal allowed')}</Td>
                            <Td>{addCommaToNumber(num_of_days_limit, display_decimals)}</Td>
                        </Row>
                        <Row>
                            <Td>{localize('Total withdrawn')}</Td>
                            <Td>{addCommaToNumber(withdrawal_since_inception_monetary, display_decimals)}</Td>
                        </Row>
                        <Row>
                            <Td>{localize('Maximum withdrawal remaining')}</Td>
                            <Td>{addCommaToNumber(remainder, display_decimals)}</Td>
                        </Row>
                    </TableBody>
                </Table>
                <TextContainer>
                    <Text size='small' color='grey'>{localize('Stated limits are subject to change without prior notice.')}</Text>
                </TextContainer>
            </section>
        );
    }
}

// AccountLimits.propTypes = {};

export default AccountLimits
