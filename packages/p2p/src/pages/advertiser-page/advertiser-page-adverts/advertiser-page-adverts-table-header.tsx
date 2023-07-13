import React from 'react';
import { DesktopWrapper, Table } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from 'Components/i18next';

const AdvertiserPageAdvertsTableHeader = () => {
    const {
        client: { currency },
    } = useStore();

    return (
        <DesktopWrapper>
            <Table.Header>
                <Table.Row className='advertiser-page-adverts__table-row'>
                    <Table.Head>
                        <Localize i18n_default_text='Limits' />
                    </Table.Head>
                    <Table.Head>
                        <Localize i18n_default_text='Rate (1 {{currency}})' values={{ currency }} />
                    </Table.Head>
                    <Table.Head>
                        <Localize i18n_default_text='Payment methods' />
                    </Table.Head>
                    <Table.Head />
                </Table.Row>
            </Table.Header>
        </DesktopWrapper>
    );
};

export default observer(AdvertiserPageAdvertsTableHeader);
