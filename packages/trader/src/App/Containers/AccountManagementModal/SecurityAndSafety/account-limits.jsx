// import PropTypes        from 'prop-types';
import React            from 'react';
import { WS }           from 'Services';
import Loading          from '../../../../templates/app/components/loading.jsx';

const TableLayout = ({ children }) => (
    <table className='account-management-table'>
        {children}
    </table>
);
const TableHead = ({ children }) => <thead>{children}</thead>
const TableHeader = ({ children }) => <th className='account-management-form-header'>{children}</th>
const TableBody = ({ children }) => <tbody>{children}</tbody>
const Row = ({ children }) => (
    <tr style={{ display: 'flex', justifyContent: 'space-between' }}>
        {children}
    </tr>
);

const Text = ({ children }) => <p className='account-management-text'>{children}</p>
const Td = ({ children }) => <td className='account-management-text'>{children}</td>

const makeTurnoverLimitRow = arr => (
    <>
        { arr &&
            arr.map(item => 
                <Row key={item.name}>
                    <Td>{item.name}</Td>
                    <Td>{item.turnover_limit}</Td>
                </Row>    
            )
        }
    </>
);
class AccountLimits extends React.Component {
    state = { is_loading: true }

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
            <div style={{overflow: 'scroll'}}>
                <Text>These are default limits that we apply to your accounts. To learn more about trading limits and how they apply, please go the Help Centre.</Text>
                <TableLayout>
                    <TableHead>
                        <Row>
                            <TableHeader>Trading limits - item</TableHeader>
                            <TableHeader>Limit</TableHeader>
                        </Row>
                    </TableHead>
                    <TableBody>
                        <Row>
                            <Td>*Maximum number of open positions</Td>
                            <Td>{ open_positions }</Td>
                        </Row>
                        <Row>
                            <Td>*Maximum account cash balance</Td>
                            <Td>{ account_balance }</Td>
                        </Row>
                        <Row>
                            <Td>Maximum aggregate payouts on open positions</Td>
                            <Td>{ payout }</Td>
                        </Row>
                    </TableBody>
                </TableLayout>
                <Text>*Any limits in your Self-exclusion settings will override these default limits.</Text>
                <TableLayout>
                    <TableHead>
                        <Row>
                            <TableHeader>Trading limits - Maximum daily turnover</TableHeader>
                            <TableHeader>Limit</TableHeader>
                        </Row>
                    </TableHead>
                    <TableBody>
                        { makeTurnoverLimitRow(commodities) }
                        { makeTurnoverLimitRow(forex) }
                        { makeTurnoverLimitRow(indices) }
                        { makeTurnoverLimitRow(volidx) }
                    </TableBody>
                </TableLayout>
                <TableLayout>
                    <TableHead>
                        <Row>
                            <TableHeader>Withdrawal limits</TableHeader>
                            <TableHeader>Limit</TableHeader>
                        </Row>
                    </TableHead>
                    <TableBody>
                        <Row>
                            <Td>Total withdrawal allowed</Td>
                            <Td>{ num_of_days_limit }</Td>
                        </Row>
                        <Row>
                            <Td>Total withdrawn</Td>
                            <Td>{ withdrawal_since_inception_monetary }</Td>
                        </Row>
                        <Row>
                            <Td>Maximum withdrawal remaining</Td>
                            <Td>{ remainder }</Td>
                        </Row>
                    </TableBody>
                </TableLayout>
                <Text>Stated limits are subject to change without prior notice.</Text>
            </div>
        );
    }
    componentDidMount() {
        WS.getAccountLimits().then((data) => {
            console.log(data);
            this.setState({ ...data.get_limits, is_loading: false });
        });
    }
}

// AccountLimits.propTypes = {};

export default AccountLimits
