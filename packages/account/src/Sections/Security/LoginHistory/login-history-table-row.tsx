import React from 'react';
import { Table, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

export type TLoginHistoryItems = {
    id: number;
    date: string;
    action: string;
    browser: string;
    ip: string;
    status: string;
};

const LoginHistoryTableRow = (props: TLoginHistoryItems) => {
    const { id, date, action, browser, ip, status } = props;
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
            <Table.Cell>
                {browser === 'Unknown' ? <Localize i18n_default_text='{{browser}}' values={{ browser }} /> : browser}
            </Table.Cell>
            <Table.Cell>{ip}</Table.Cell>
            <Table.Cell>
                <Localize i18n_default_text='{{status}}' values={{ status }} />
            </Table.Cell>
        </Table.Row>
    );
};

export default LoginHistoryTableRow;
