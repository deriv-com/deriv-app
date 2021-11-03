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
import PropTypes from 'prop-types';

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
        <Text key={index} as='p' weight='bold' align='center' color='prominent' size='xxxs'>
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
                            <Text
                                as='p'
                                align='center'
                                color='prominent'
                                size='xxxs'
                                className='mul-cfd-table-cell-cfd-label'
                            >
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

const DemoBanner = () => (
    <div className='mul-cfd-compare-accounts__table-desc'>
        <Text as='p' align='center' color='var(--general-main-1)' size='xxxs'>
            {localize('You are currently using this in demo')}
        </Text>
    </div>
);

const ModalContent = ({ openRealAccountSignup, toggleUpgradeAccounts }) => {
    return (
        <Div100vhContainer height_offset='40px' is_bypassed={isDesktop()}>
            <ThemedScrollbars className='mul-cfd-compare-accounts'>
                <div className='mul-cfd-compare-accounts__table-wrapper'>
                    <Table className='mul-cfd-compare-accounts__table'>
                        <Table.Header>
                            <Table.Row className='mul-cfd-compare-accounts__table-row'>
                                <Table.Head />
                                <Table.Head>
                                    <div className='mul-cfd-compare-accounts__table-head'>
                                        <Icon icon='IcCrossSolid' size={48} />
                                        <Text as='p' align='center' color='prominent' weight='bold' size='sm'>
                                            {localize('Multipliers')}
                                        </Text>
                                        <DemoBanner />
                                    </div>
                                </Table.Head>
                                <Table.Head>
                                    <div className='mul-cfd-compare-accounts__table-head'>
                                        <Icon icon='IcPercentSolid' size={48} />
                                        <Text as='p' align='center' color='prominent' weight='bold' size='sm'>
                                            {localize('CFDs')}
                                        </Text>
                                        <DemoBanner />
                                    </div>
                                </Table.Head>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {data.map(row => (
                                <Row key={row.title} {...row} />
                            ))}
                        </Table.Body>
                        <Table.Footer className='mul-cfd-compare-accounts__table-footer'>
                            <Table.Row className='mul-cfd-compare-accounts__table-row'>
                                <Table.Cell />
                                <Table.Cell>
                                    <Button
                                        className='mul-cfd-compare-accounts__table-footer'
                                        type='button'
                                        secondary
                                        onClick={() => {
                                            toggleUpgradeAccounts();
                                            openRealAccountSignup('maltainvest', `Deriv Multiplier`);
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
                        {localize('You can add the other account later')}
                    </Text>
                </div>
            </ThemedScrollbars>
        </Div100vhContainer>
    );
};

const UpgradeAccountsModal = ({ is_upgrade_modal_visible, toggleUpgradeAccounts, openRealAccountSignup }) => {
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
                        <ModalContent
                            openRealAccountSignup={openRealAccountSignup}
                            toggleUpgradeAccounts={toggleUpgradeAccounts}
                        />
                    </Modal>
                </DesktopWrapper>
            </React.Suspense>
        </div>
    );
};

UpgradeAccountsModal.propTypes = {
    is_upgrade_modal_visible: PropTypes.bool,
    toggleUpgradeAccounts: PropTypes.func,
    openRealAccountSignup: PropTypes.func,
};
export default connect(({ ui }) => ({
    is_upgrade_modal_visible: ui.is_upgrade_modal_visible,
    toggleUpgradeAccounts: ui.toggleUpgradeModal,
    openRealAccountSignup: ui.openRealAccountSignup,
}))(UpgradeAccountsModal);
