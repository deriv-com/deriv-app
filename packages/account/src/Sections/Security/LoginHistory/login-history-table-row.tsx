import { Table, Text } from '@deriv/components';
import { Localize } from '@deriv-com/translations';
import { TLoginHistoryItems } from '../../../Types';

const LoginHistoryTableRow = ({ id, date, action, browser, ip, status }: TLoginHistoryItems) => {
    return (
        <Table.Row className='login-history__table__row' key={id}>
            <Table.Cell>
                <Text line_height='xs' size='xs'>
                    {date}
                </Text>
            </Table.Cell>
            <Table.Cell className='login-history__table__row__cell login-history__table__row__cell--action'>
                <Localize i18n_default_text='{{action}}' values={{ action }} />
            </Table.Cell>
            <Table.Cell>{browser === 'Unknown' ? <Localize i18n_default_text='Unknown' /> : browser}</Table.Cell>
            <Table.Cell>{ip}</Table.Cell>
            <Table.Cell>
                <Localize i18n_default_text='{{status}}' values={{ status }} />
            </Table.Cell>
        </Table.Row>
    );
};

export default LoginHistoryTableRow;
