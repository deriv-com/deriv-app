import React from 'react';
import {
    Button,
    Popover,
    Modal,
    DesktopWrapper,
    MobileDialog,
    MobileWrapper,
    Table,
    UILoader,
    Text,
} from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const MT5AttributeDescriberModal = ({ is_visible, toggleModal, message }) => (
    <Modal is_open={is_visible} small toggleModal={toggleModal}>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
            <Button has_effect text={localize('OK')} onClick={toggleModal} primary />
        </Modal.Footer>
    </Modal>
);

const MT5AttributeDescriber = ({ name, tooltip, counter }) => {
    const [is_visible, setIsVisible] = React.useState(false);
    const toggleModal = () => setIsVisible(!is_visible);

    return tooltip ? (
        <React.Fragment>
            <Text
                as='p'
                weight='bold'
                size='xs'
                line_height='s'
                className='mt5-attribute-describer'
                onClick={toggleModal}
            >
                {name}
                <MobileWrapper>
                    <Text weight='bold' line_height='x' size='xxxs' className='counter'>
                        {counter}
                    </Text>
                </MobileWrapper>
            </Text>
            <DesktopWrapper>
                <Popover alignment='right' icon='counter' counter={counter} message={tooltip} zIndex={9998} />
            </DesktopWrapper>
            <MobileWrapper>
                <MT5AttributeDescriberModal toggleModal={toggleModal} is_visible={is_visible} message={tooltip} />
            </MobileWrapper>
        </React.Fragment>
    ) : (
        <Text as='p' weight='bold' size='xs' line_height='s' className='mt5-attribute-describer'>
            {name}
        </Text>
    );
};

const filterAvailableAccounts = (landing_companies, table, is_logged_in) => {
    return table.map(({ attribute, synthetic, financial_stp, financial }) => {
        if (is_logged_in) {
            return {
                attribute,
                ...(landing_companies?.mt_gaming_company?.financial ? { synthetic } : {}),
                ...(landing_companies?.mt_financial_company?.financial ? { financial } : {}),
                ...(landing_companies?.mt_financial_company?.financial_stp ? { financial_stp } : {}),
            };
        }
        return {
            attribute,
            ...{ synthetic },
            ...{ financial },
            ...{ financial_stp },
        };
    });
};

const compareAccountsData = ({ landing_companies, is_eu, is_eu_country, is_logged_in }) => {
    const show_eu_related = (is_logged_in && is_eu) || (!is_logged_in && is_eu_country);
    return filterAvailableAccounts(
        landing_companies,
        [
            {
                attribute: <MT5AttributeDescriber name={localize('Account currency')} />,
                synthetic: show_eu_related ? localize('EUR') : localize('USD'),
                financial: show_eu_related ? localize('EUR/GBP') : localize('USD'),
                financial_stp: localize('USD'),
            },
            {
                attribute: <MT5AttributeDescriber name={localize('Maximum leverage')} />,
                synthetic: localize('Up to 1:1000'),
                financial: show_eu_related ? localize('Up to 1:30') : localize('Up to 1:1000'),
                financial_stp: localize('Up to 1:100'),
            },
            {
                attribute: <MT5AttributeDescriber name={localize('Order execution')} />,
                synthetic: localize('Market'),
                financial: localize('Market'),
                financial_stp: localize('Market'),
            },
            {
                attribute: <MT5AttributeDescriber name={localize('Spread')} />,
                synthetic: localize('Fixed/Variable'),
                financial: localize('Variable'),
                financial_stp: localize('Variable'),
            },
            {
                attribute: <MT5AttributeDescriber name={localize('Commission')} />,
                synthetic: localize('No'),
                financial: localize('No'),
                financial_stp: localize('No'),
            },
            {
                attribute: <MT5AttributeDescriber name={localize('Minimum deposit')} />,
                synthetic: localize('No'),
                financial: localize('No'),
                financial_stp: localize('No'),
            },
            {
                attribute: <MT5AttributeDescriber name={localize('Margin call')} />,
                synthetic: localize('100%'),
                financial: show_eu_related ? localize('100%') : localize('150%'),
                financial_stp: localize('150%'),
            },
            {
                attribute: <MT5AttributeDescriber name={localize('Stop out level')} />,
                synthetic: localize('50%'),
                financial: show_eu_related ? localize('50%') : localize('75%'),
                financial_stp: localize('75%'),
            },
            {
                attribute: <MT5AttributeDescriber name={localize('Number of assets')} />,
                synthetic: localize('10+'),
                financial: localize('50+'),
                financial_stp: localize('50+'),
            },
            {
                attribute: <MT5AttributeDescriber name={localize('Cryptocurrency trading')} />,
                synthetic: localize('N/A'),
                financial: localize('24/7'),
                financial_stp: localize('24/7'),
            },
            {
                attribute: <MT5AttributeDescriber name={localize('Trading instruments')} />,
                synthetic: localize('Synthetics'),
                financial: show_eu_related
                    ? localize('FX-majors (standard), FX-minors, Commodities, Cryptocurrencies')
                    : localize('FX-majors (standard/micro lots), FX-minors, Commodities, Cryptocurrencies'),
                financial_stp: localize('FX-majors, FX-minors, FX-exotics, Cryptocurrencies'),
            },
        ],
        is_logged_in
    );
};

const MT5CompareAccountHint = () => (
    <div className='mt5-compare-account--hint'>
        <div className='mt5-compare-accounts__bullet-wrapper'>
            <span className='mt5-compare-accounts__bullet mt5-compare-accounts__bullet--circle' />
            <Localize i18n_default_text='At bank rollover, liquidity in the forex markets is reduced and may increase the spread and processing time for client orders. This happens around 21:00 GMT during daylight saving time, and 22:00 GMT non-daylight saving time.' />
        </div>
        <div className='mt5-compare-accounts__bullet-wrapper'>
            <Text
                size='xs'
                line_height='x'
                weight='bold'
                className='mt5-compare-accounts__bullet mt5-compare-accounts__bullet--star mt5-compare-accounts__star'
            >
                *
            </Text>
            <Localize i18n_default_text='To protect your portfolio from adverse market movements due to the market opening gap, we reserve the right to decrease leverage on all offered symbols for financial accounts before market close and increase it again after market open. Please make sure that you have enough funds available in your MT5 account to support your positions at all times.' />
        </div>
    </div>
);

const ModalContent = ({ is_eu, landing_companies, is_eu_country, is_logged_in }) => {
    const [cols, setCols] = React.useState([]);
    const [template_columns, updateColumnsStyle] = React.useState('1.5fr 1fr 2fr 1fr');

    React.useEffect(() => {
        setCols(compareAccountsData({ landing_companies, is_eu, is_eu_country, is_logged_in }));

        if (is_logged_in) {
            updateColumnsStyle(
                `1.5fr ${landing_companies?.mt_gaming_company?.financial ? '1fr' : ''} ${
                    landing_companies?.mt_financial_company?.financial ? '2fr' : ''
                } ${landing_companies?.mt_financial_company?.financial_stp ? ' 1fr ' : ''}`
            );
        }
    }, [
        landing_companies.mt_financial_company,
        landing_companies.mt_gaming_company,
        is_eu,
        is_logged_in,
        is_eu_country,
        landing_companies,
    ]);

    return (
        <div
            className='mt5-compare-accounts'
            style={{
                '--mt5-compare-accounts-template-columns': template_columns,
            }}
        >
            <Table fixed scroll_height={isMobile() ? '100%' : 'calc(100% - 130px)'}>
                <Table.Header>
                    <Table.Row className='mt5-compare-accounts__table-row'>
                        <Table.Head fixed />
                        {is_logged_in ? (
                            <React.Fragment>
                                {landing_companies?.mt_gaming_company?.financial && (
                                    <Table.Head>{localize('Synthetic')}</Table.Head>
                                )}
                                {landing_companies?.mt_financial_company?.financial && (
                                    <Table.Head>
                                        {localize('Financial')}
                                        <Text size='s' weight='bold' className='mt5-compare-accounts__star'>
                                            *
                                        </Text>
                                    </Table.Head>
                                )}
                                {landing_companies?.mt_financial_company?.financial_stp && (
                                    <Table.Head>
                                        {localize('Financial STP')}
                                        <Text size='s' weight='bold' className='mt5-compare-accounts__star'>
                                            *
                                        </Text>
                                    </Table.Head>
                                )}
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <Table.Head>{localize('Synthetic')}</Table.Head>
                                <Table.Head>
                                    {localize('Financial')}
                                    <Text size='s' weight='bold' className='mt5-compare-accounts__star'>
                                        *
                                    </Text>
                                </Table.Head>
                                <Table.Head>
                                    {localize('Financial STP')}
                                    <Text size='s' weight='bold' className='mt5-compare-accounts__star'>
                                        *
                                    </Text>
                                </Table.Head>
                            </React.Fragment>
                        )}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {cols.map((row, i) => (
                        <Table.Row key={i} className='mt5-compare-accounts__table-row'>
                            {Object.keys(row).map((col, j) => (
                                <Table.Cell key={j} fixed={j === 0}>
                                    {row[col]}
                                </Table.Cell>
                            ))}
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            <DesktopWrapper>
                <MT5CompareAccountHint />
            </DesktopWrapper>
        </div>
    );
};

const CompareAccountsModal = ({
    disableApp,
    enableApp,
    is_compare_accounts_visible,
    landing_companies,
    is_loading,
    is_logged_in,
    is_eu,
    is_eu_country,
    toggleCompareAccounts,
}) => (
    <div className='mt5-compare-accounts-modal__wrapper'>
        <Button
            className='mt5-dashboard__welcome-message--button'
            has_effect
            text={localize('Compare accounts')}
            onClick={toggleCompareAccounts}
            secondary
            disabled={is_loading}
        />
        <React.Suspense fallback={<UILoader />}>
            <DesktopWrapper>
                <Modal
                    className='mt5-dashboard__compare-accounts'
                    disableApp={disableApp}
                    enableApp={enableApp}
                    is_open={is_compare_accounts_visible}
                    title={localize('Compare accounts')}
                    toggleModal={toggleCompareAccounts}
                    type='button'
                    height='696px'
                    width='903px'
                >
                    <ModalContent
                        is_logged_in={is_logged_in}
                        is_eu={is_eu}
                        is_eu_country={is_eu_country}
                        landing_companies={landing_companies}
                    />
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='deriv_app'
                    title={localize('Compare accounts')}
                    wrapper_classname='mt5-dashboard__compare-accounts'
                    visible={is_compare_accounts_visible}
                    onClose={toggleCompareAccounts}
                    footer={<MT5CompareAccountHint />}
                >
                    <ModalContent
                        is_logged_in={is_logged_in}
                        is_eu={is_eu}
                        is_eu_country={is_eu_country}
                        landing_companies={landing_companies}
                    />
                </MobileDialog>
            </MobileWrapper>
        </React.Suspense>
    </div>
);

export default connect(({ modules, ui, client }) => ({
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_compare_accounts_visible: modules.mt5.is_compare_accounts_visible,
    is_loading: client.is_populating_mt5_account_list,
    is_eu: client.is_eu,
    is_eu_country: client.is_eu_country,
    is_logged_in: client.is_logged_in,
    landing_companies: client.landing_companies,
    toggleCompareAccounts: modules.mt5.toggleCompareAccountsModal,
}))(CompareAccountsModal);
