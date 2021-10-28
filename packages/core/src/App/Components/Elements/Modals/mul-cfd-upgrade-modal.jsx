import React from 'react';
import {
    Button,
    Modal,
    DesktopWrapper,
    Table,
    UILoader,
    Text,
    ThemedScrollbars,
    Div100vhContainer,
    Icon,
} from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { isDesktop, routes } from '@deriv/shared';
import 'Sass/app/_common/components/mul-cfd-upgrade-modal.scss';
const data = [
    {
        title: localize('Platforms'),
        multiplier: [
            {
                title: localize('Dtrader'),
                icon: 'IcBrandDtrader',
            },
        ],
        cfd: [
            {
                title: localize('DMT5'),
                icon: 'IcBrandDmt5',
            },
        ],
        has_icons: true,
    },

    {
        title: localize('Asset classes'),
        multiplier: [
            {
                title: localize('Synthetics'),
                icon: 'IcAssetsSynthetics',
            },
            {
                title: localize('Forex'),
                icon: 'IcAssetsForex',
            },
        ],
        cfd: [
            {
                title: localize('Synthetics'),
                icon: 'IcAssetsSynthetics',
            },
            {
                title: localize('Forex'),
                icon: 'IcAssetsForex',
            },
            {
                title: localize('Stocks'),
                icon: 'IcAssetsStocks',
            },
            {
                title: localize('Indices'),
                icon: 'IcAssetsIndices',
            },
            {
                title: localize('Commodities'),
                icon: 'IcAssetsCommodities',
            },
            {
                title: localize('Cryptos'),
                icon: 'IcAssetsCrypto',
            },
        ],
        has_icons: true,
        mutliplier_desc: localize('Trade our new synthetics and forex with Multipliers account.'),
        cfd_desc: localize('Trade synthetics, forex, stocks, indices, commodities and crypto with CFDs account.'),
    },
    {
        title: localize('Assets'),
        multiplier: [localize('5+ Synthetic indices'), localize('10+Forex pairs')],
        cfd: [
            localize('5+ Synthetic indices'),
            localize('30+ Forex pairs'),
            localize('40+ Stocks'),
            localize('10+ Stock indices'),
            localize('10+ Cryptocurrency/fiat pairs'),
            localize('10+ Commodities'),
        ],
        has_icons: false,
    },
];
const Items = ({ items }) =>
    items.map(({ title, icon }) => (
        <div key={title} className='mul-cfd-compare-table-item'>
            <Icon icon={icon} size='24' />
            <Text as='p' align='center' color='prominent' size='xxxxs' className='mul-cfd-compare-table-item__text'>
                {title}
            </Text>
        </div>
    ));
const MultilineRowItems = ({ items }) =>
    items.map((item, index) => (
        <Text key={index} as='p' weight='bold' align='center' color='prominent' size='xxs'>
            {item}
        </Text>
    ));

const Row = ({ title, multiplier, cfd, has_icons, mutliplier_desc, cfd_desc }) => (
    <>
        <Table.Row className={has_icons ? 'mul-cfd-compare-table-row-items' : 'mul-cfd-compare-table-row'}>
            <Table.Cell>
                <Text as='p' weight='bold' align='center' color='prominent' size='xs'>
                    {title}
                </Text>
            </Table.Cell>
            <Table.Cell>
                {has_icons ? (
                    <>
                        <div className='mul-cfd-table-cell-icons'>
                            <Items items={multiplier} />
                        </div>
                        {mutliplier_desc && (
                            <Text as='p' align='center' color='prominent' size='xxxs'>
                                {mutliplier_desc}
                            </Text>
                        )}
                    </>
                ) : (
                    <div>
                        <MultilineRowItems items={multiplier} />
                    </div>
                )}
            </Table.Cell>
            <Table.Cell>
                {has_icons ? (
                    <>
                        <div className='mul-cfd-table-cell-icons'>
                            <Items items={cfd} />
                        </div>
                        {cfd_desc && (
                            <Text as='p' align='center' color='prominent' size='xxxs'>
                                {cfd_desc}
                            </Text>
                        )}
                    </>
                ) : (
                    <div>
                        <MultilineRowItems items={cfd} />
                    </div>
                )}
            </Table.Cell>
        </Table.Row>
    </>
);

const ModalContent = () => {
    return (
        <Div100vhContainer height_offset='40px' is_bypassed={isDesktop()}>
            <ThemedScrollbars className='mul-cfd-compare-accounts'>
                <div className='mul-cfd-compare-accounts__table-wrapper'>
                    <Table className='mul-cfd-compare-accounts__table'>
                        <Table.Header>
                            <Table.Row className='mul-cfd-compare-accounts__table-row'>
                                <DesktopWrapper>
                                    <Table.Head />
                                </DesktopWrapper>
                                <Table.Head>
                                    <div className='mul-cfd-compare-accounts__table-head'>
                                        <Icon icon='IcCrossSolid' size={48} />
                                        <Text as='p' align='center' color='prominent' weight='bold' size='sm'>
                                            {'Multipliers'}
                                        </Text>
                                        <div>
                                            <Text
                                                as='p'
                                                align='center'
                                                color='less-prominent'
                                                size='xxxs'
                                                className='mul-cfd-compare-accounts__table-desc'
                                            >
                                                {'You are currently using this in demo'}
                                            </Text>
                                        </div>
                                    </div>
                                </Table.Head>
                                <Table.Head>
                                    <div>
                                        <Icon icon='IcPercentSolid' size={48} />
                                        <Text as='p' align='center' color='prominent' weight='bold' size='sm'>
                                            {'CFDs'}
                                        </Text>
                                    </div>
                                </Table.Head>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {data.map(row => (
                                <Row key={row.title} {...row} />
                            ))}
                        </Table.Body>
                        <Table.Footer>
                            <Table.Row className='mul-cfd-compare-accounts__table-row'>
                                <DesktopWrapper>
                                    <Table.Cell />
                                </DesktopWrapper>
                                <Table.Cell>
                                    <Button
                                        className='mul-cfd-compare-accounts__table-footer'
                                        type='button'
                                        secondary
                                        onClick={() => {
                                            history.push(routes.mt5);
                                        }}
                                    >
                                        {localize('Add real account')}
                                    </Button>
                                </Table.Cell>
                                <Table.Cell>
                                    <Button
                                        className='mul-cfd-compare-accounts__table-footer'
                                        type='button'
                                        secondary
                                        onClick={() => {
                                            history.push(routes.dxtrade);
                                        }}
                                    >
                                        {localize('Add real account')}
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                    <Text as='p' size='xxs' color='less-prominent' align='center'>
                        {'You can add the other account later'}
                    </Text>
                </div>
            </ThemedScrollbars>
        </Div100vhContainer>
    );
};

const UpgradeAccountsModal = ({ is_upgrade_modal_visible, toggleUpgradeAccounts }) => {
    return (
        <div className='cfd-compare-accounts-modal__wrapper'>
            <React.Suspense fallback={<UILoader />}>
                <DesktopWrapper>
                    <Modal
                        className='mul_cfd_compare-accounts'
                        is_open={is_upgrade_modal_visible}
                        title={localize('Please choose your account')}
                        toggleModal={toggleUpgradeAccounts}
                        type='button'
                        height='636px'
                        width='739px'
                    >
                        <ModalContent />
                    </Modal>
                </DesktopWrapper>
            </React.Suspense>
        </div>
    );
};

export default connect(({ ui }) => ({
    is_upgrade_modal_visible: ui.is_upgrade_modal_visible,
    toggleUpgradeAccounts: ui.toggleUpgradeModal,
}))(UpgradeAccountsModal);
