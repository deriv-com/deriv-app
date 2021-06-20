import React from 'react';
import { Button, Text, Table, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';

const data = [
    {
        title: 'Operating Systems',
        dmt5: [
            { title: 'iOS', icon: 'IcIos' },
            { title: 'Android', icon: 'IcAndroid' },
            { title: 'Windows', icon: 'IcWindowsGray' },
            { title: 'macOS', icon: 'IcMacos2' },
            { title: 'Linux', icon: 'IcLinux2' },
            { title: 'Browser', icon: 'IcBrowser' },
        ],
        derivx: [
            { title: 'iOS', icon: 'IcIos' },
            { title: 'Android', icon: 'IcAndroid' },
            { title: 'Browser', icon: 'IcBrowser' },
        ],
    },
    {
        title: 'Asset classes',
        dmt5: [
            {
                title: 'Synthetics',
                icon: 'IcMt5Synthetics',
            },
            {
                title: 'Cryptos',
                icon: 'IcMt5Cryptos',
            },
            {
                title: 'Indices',
                icon: 'IcMt5Cryptos',
            },
            {
                title: 'Stocks',
                icon: 'IcMt5Stocks',
            },
            {
                title: 'Forex',
                icon: 'IcMt5Forex',
            },
            {
                title: 'Commodities',
                icon: 'IcMt5Commodities',
            },
        ],
        derivx: [
            {
                title: 'Synthetics',
                icon: 'IcMt5Synthetics',
            },
            {
                title: 'Cryptos',
                icon: 'IcMt5Cryptos',
            },
            {
                title: 'Indices',
                icon: 'IcMt5Cryptos',
            },
            {
                title: 'Stocks',
                icon: 'IcMt5Stocks',
            },
            {
                title: 'Forex',
                icon: 'IcMt5Forex',
            },
            {
                title: 'Commodities',
                icon: 'IcMt5Commodities',
            },
        ],
    },
    {
        title: 'Assets',
        dmt5: '190+',
        derivx: '190+',
    },
    {
        title: 'Leverage',
        dmt5: 'Up to 1:1000',
        derivx: 'Up to 1:1000',
    },
    {
        title: 'Trading signals',
        dmt5: 'Yes',
        derivx: 'No',
    },
    {
        title: 'Customisability',
        dmt5: 'Moderate',
        derivx: 'High',
    },
];

const Items = ({ items }) =>
    items.map(({ title, icon }) => (
        <div key={title} className='platform-item'>
            <Icon icon={icon} size={16} />
            <Text as='p' align='center' color='prominent' size='xxxs'>
                {localize(title)}
            </Text>
        </div>
    ));

const Row = ({ title, dmt5, derivx }) => (
    <Table.Row className='platform-table-row'>
        <Table.Cell className='platform-table-col'>
            <Text as='p' weight='bold' align='center' color='prominent' size='xs'>
                {localize(title)}
            </Text>
        </Table.Cell>
        <Table.Cell className='platform-table-col'>
            {Array.isArray(dmt5) ? (
                <Items items={dmt5} />
            ) : (
                <Text as='p' weight='bold' align='center' color='prominent' size='s'>
                    {localize(dmt5)}
                </Text>
            )}
        </Table.Cell>
        <Table.Cell className='platform-table-col'>
            {Array.isArray(derivx) ? (
                <Items items={derivx} />
            ) : (
                <Text as='p' weight='bold' align='center' color='prominent' size='s'>
                    {localize(derivx)}
                </Text>
            )}
        </Table.Cell>
    </Table.Row>
);

const Platforms = () => (
    <section className='platform-onboarding'>
        <Text as='h2' weight='bold' align='center' color='prominent' size='m'>
            {localize('Platforms')}
        </Text>
        <Table fixed scroll_width={996} scroll_height={600}>
            <Table.Header>
                <Table.Row className='platform-table-row'>
                    <Table.Head />
                    <Table.Head>
                        <Icon icon='IcBrandDmt5' size={48} />
                        <Text as='h2' weight='bold' align='center' color='prominent' size='m'>
                            {localize('DMT5')}
                        </Text>
                    </Table.Head>
                    <Table.Head>
                        <Icon icon='IcBrandDxtrade' size={48} />
                        <Text as='h2' weight='bold' align='center' color='prominent' size='m'>
                            {localize('Deriv X')}
                        </Text>
                    </Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.map(item => (
                    <Row key={item.title} {...item} />
                ))}
            </Table.Body>
            <Table.Footer>
                <Table.Row className='platform-table-row'>
                    <Table.Cell className='platform-table-col' />
                    <Table.Cell className='platform-table-col'>
                        <Button type='button' secondary small>
                            {localize('Choose DMT5')}
                        </Button>
                    </Table.Cell>
                    <Table.Cell className='platform-table-col'>
                        <Button type='button' secondary small>
                            {localize('Choose Deriv X')}
                        </Button>
                    </Table.Cell>
                </Table.Row>
            </Table.Footer>
        </Table>
    </section>
);

export default Platforms;
