import {
    Button,
    Popover,
    Modal,
    DesktopWrapper,
    MobileDialog,
    MobileWrapper,
    Table,
    UILoader,
} from '@deriv/components';
import React, { useState } from 'react';
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
    const [is_visible, setIsVisible] = useState(false);
    const toggleModal = () => setIsVisible(!is_visible);

    return tooltip ? (
        <React.Fragment>
            <p className='mt5-attribute-describer' onClick={toggleModal}>
                {name}
                <MobileWrapper>
                    <span className='counter'>{counter}</span>
                </MobileWrapper>
            </p>
            <DesktopWrapper>
                <Popover alignment='right' icon='counter' counter={counter} message={tooltip} />
            </DesktopWrapper>
            <MobileWrapper>
                <MT5AttributeDescriberModal toggleModal={toggleModal} is_visible={is_visible} message={tooltip} />
            </MobileWrapper>
        </React.Fragment>
    ) : (
        <p className='mt5-attribute-describer'>{name}</p>
    );
};

const compareAccountsData = [
    {
        attribute: <MT5AttributeDescriber name={localize('Account currency')} />,
        standard: localize('USD'),
        advanced: localize('USD'),
        synthetic: localize('USD'),
    },
    {
        attribute: (
            <MT5AttributeDescriber
                name={localize('Maximum leverage')}
                counter={1}
                tooltip={localize(
                    'Leverage gives you the ability to trade a larger position using your existing capital. Leverage varies across different symbols.'
                )}
            />
        ),
        standard: localize('Up to 1:1000'),
        advanced: localize('Up to 1:100'),
        synthetic: localize('Up to 1:1000'),
    },
    {
        attribute: (
            <MT5AttributeDescriber
                name={localize('Order execution')}
                counter={2}
                tooltip={localize(
                    "All 3 account types use market execution. This means you agree with the broker's price in advance and will place orders at the broker's price."
                )}
            />
        ),
        standard: localize('Market'),
        advanced: localize('Market'),
        synthetic: localize('Market'),
    },
    {
        attribute: (
            <MT5AttributeDescriber
                name={localize('Spread')}
                counter={3}
                tooltip={localize(
                    "The spread is the difference between the buy price and sell price. A variable spread means that the spread is constantly changing, depending on market conditions. A fixed spread remains constant but is subject to alteration, at the Broker's absolute discretion."
                )}
            />
        ),
        standard: localize('Variable'),
        advanced: localize('Variable'),
        synthetic: localize('Fixed/Variable'),
    },
    {
        attribute: (
            <MT5AttributeDescriber
                name={localize('Commission')}
                counter={4}
                tooltip={localize(
                    'Deriv charges no commission across all account types, except cryptocurrency accounts.'
                )}
            />
        ),
        standard: localize('No'),
        advanced: localize('No'),
        synthetic: localize('No'),
    },
    {
        attribute: <MT5AttributeDescriber name={localize('Minimum deposit')} />,
        standard: localize('No'),
        advanced: localize('No'),
        synthetic: localize('No'),
    },
    {
        attribute: (
            <MT5AttributeDescriber
                name={localize('Margin call')}
                counter={5}
                tooltip={localize(
                    'When the remaining funds in your account is deemed insufficient to cover the leverage or margin requirements, your account will be placed under margin call. To prevent a margin call escalating to a stop out level, you can deposit  additional funds into your account or close any open positions.'
                )}
            />
        ),
        standard: localize('150%'),
        advanced: localize('150%'),
        synthetic: localize('100%'),
    },
    {
        attribute: (
            <MT5AttributeDescriber
                name={localize('Stop out level')}
                counter={6}
                tooltip={localize(
                    'If your account reaches the stop out level, then your account will be in stop out state. Trading positions and orders on your account are forcibly closed until there are no more open positions or until your margin level increases above the stop out level.'
                )}
            />
        ),
        standard: localize('75%'),
        advanced: localize('75%'),
        synthetic: localize('50%'),
    },
    {
        attribute: <MT5AttributeDescriber name={localize('Number of assets')} />,
        standard: localize('50+'),
        advanced: localize('50+'),
        synthetic: localize('10+'),
    },
    {
        attribute: (
            <MT5AttributeDescriber
                name={localize('Cryptocurrency trading')}
                counter={7}
                tooltip={localize('Indicates the availability of cryptocurrency trading on a particular account.')}
            />
        ),
        standard: localize('24/7'),
        advanced: localize('N/A'),
        synthetic: localize('N/A'),
    },
    {
        attribute: <MT5AttributeDescriber name={localize('Trading instruments')} />,
        standard: localize('FX-majors (standard/micro lots), FX-minors, Commodities, Cryptocurrencies'),
        advanced: localize('FX-majors, FX-minors, FX-exotics'),
        synthetic: localize('Synthetics'),
    },
];

const MT5CompareAccountHint = () => (
    <p className='mt5-compare-account--hint'>
        <Localize i18n_default_text='Note: At bank rollover, liquidity in the forex markets is reduced and may increase the spread and processing time for client orders. This happens around 21:00 GMT during daylight saving time, and 22:00 GMT non-daylight saving time.' />
    </p>
);

const ModalContent = () => (
    <div className='mt5-compare-accounts'>
        <Table fixed>
            <Table.Header>
                <Table.Row>
                    <Table.Head fixed>{localize('')}</Table.Head>
                    <Table.Head>{localize('Standard')}</Table.Head>
                    <Table.Head>{localize('Advanced')}</Table.Head>
                    <Table.Head>{localize('Synthetic Indices')}</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {compareAccountsData.map((row, i) => (
                    <Table.Row key={i}>
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

const CompareAccountsModal = ({ disableApp, enableApp, is_compare_accounts_visible, toggleCompareAccounts }) => (
    <div className='mt5-compare-accounts-modal__wrapper'>
        <Button
            className='mt5-dashboard__welcome-message--button'
            has_effect
            text={localize('Compare accounts')}
            onClick={toggleCompareAccounts}
            tertiary
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
                    height='580px'
                    width='904px'
                >
                    <ModalContent />
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
                    <ModalContent />
                </MobileDialog>
            </MobileWrapper>
        </React.Suspense>
    </div>
);

export default connect(({ modules, ui }) => ({
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_compare_accounts_visible: modules.mt5.is_compare_accounts_visible,
    toggleCompareAccounts: modules.mt5.toggleCompareAccountsModal,
}))(CompareAccountsModal);
