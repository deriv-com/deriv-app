import React from 'react';
import {
    DesktopWrapper,
    MobileDialog,
    MobileWrapper,
    Modal,
    UILoader,
    Text,
    Icon,
    Button,
    Checkbox,
    StaticUrl,
} from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';

const MigrateAccount = ({ to, type }: { to: string; type: string }) => {
    const getFromAccountIcon = () => {
        switch (type) {
            case 'derived':
                return 'IcMt5SvgDerived';
            case 'financial':
                return 'IcMt5SvgFinancial';
            default:
                return '';
        }
    };

    const getToAccountIcon = (to_type: string) => {
        switch (to_type) {
            case 'bvi_derived':
                return 'IcMt5BviDerived';
            case 'bvi_financial':
                return 'IcMt5BviFinancial';
            case 'vanuatu_derived':
                return 'IcMt5VanuatuDerived';
            case 'vanuatu_financial':
                return 'IcMt5VanuatuFinancial';
            default:
                return '';
        }
    };

    return (
        <React.Fragment>
            <Icon icon={getFromAccountIcon()} height={99} width={96} />
            <Icon icon='IcLongArrowRight' height={24} width={24} />
            <Icon icon={getToAccountIcon(`${to}_${type}`)} height={99} width={96} />
        </React.Fragment>
    );
};

type TMT5MigrationModalProps = {
    openPasswordModal: (acc_type: unknown) => void;
};

const MT5MigrationModal = observer(({ openPasswordModal }: TMT5MigrationModalProps) => {
    const { ui } = useStore();
    const {
        svg_accounts_to_migrate,
        no_of_svg_accounts_to_migrate,
        eligible_account_to_migrate,
        eligible_svg_to_bvi_derived_accounts,
        eligible_svg_to_bvi_financial_accounts,
        eligible_svg_to_vanuatu_derived_accounts,
        eligible_svg_to_vanuatu_financial_accounts,
    } = useMT5SVGEligibleToMigrate();

    const { disableApp, enableApp, is_mt5_migration_modal_open, toggleMT5MigrationModal } = ui;
    const [show_modal_front_side, setShowModalFrontSide] = React.useState(true);
    const [is_checked, setIsChecked] = React.useState(false);
    const modal_title = <Localize i18n_default_text='Enhancing your trading experience' />;

    const ShowFrontSide = () => (
        <React.Fragment>
            <div>
                <div className='mt5-migration-modal__description'>
                    <Text as='p' color='general' size='s' align='center'>
                        <Localize
                            i18n_default_text='We’re upgrading your SVG account(s) by moving them to the {{eligible_account_to_migrate}} jurisdiction.'
                            values={{
                                eligible_account_to_migrate,
                            }}
                        />
                    </Text>
                </div>
                <div className='mt5-migration-modal__migration_content'>
                    <div className='mt5-migration-modal__migration_content-items'>
                        {eligible_svg_to_bvi_derived_accounts && <MigrateAccount to='bvi' type='derived' />}
                        {eligible_svg_to_bvi_financial_accounts && <MigrateAccount to='bvi' type='financial' />}
                    </div>
                    <div className='mt5-migration-modal__migration_content-items'>
                        {eligible_svg_to_vanuatu_derived_accounts && <MigrateAccount to='vanuatu' type='derived' />}
                        {eligible_svg_to_vanuatu_financial_accounts && <MigrateAccount to='vanuatu' type='financial' />}
                    </div>
                </div>
                <div>
                    <Text as='p' align='center'>
                        <Localize
                            i18n_default_text='Click <0>Next</0> to start your transition.'
                            components={[<strong key={0} />]}
                        />
                    </Text>
                </div>
            </div>
        </React.Fragment>
    );

    const ShowBackSide = () => (
        <React.Fragment>
            <div>
                <div className='mt5-migration-modal__description'>
                    <Text as='p' color='general' size='s' align='center' weight='bold'>
                        <Localize i18n_default_text='What will happen to the funds in my existing account(s)?' />
                    </Text>
                </div>
                <div className='mt5-migration-modal__existing-accounts'>
                    <div className='mt5-migration-modal__existing-accounts-card'>
                        <div className='mt5-migration-modal__existing-accounts-card-content'>
                            <Text as='div' weight='bold'>
                                <Localize i18n_default_text='If you have open positions' />
                            </Text>

                            <Text as='div' size='xs'>
                                <Localize i18n_default_text='Your funds will remain in your existing MT5 account(s).' />
                            </Text>

                            <Text as='div' size='xs'>
                                <Localize i18n_default_text='You can continue trading on your existing MT5 account(s) until you close all open positions.' />
                            </Text>

                            <Text as='div' size='xs'>
                                <Localize i18n_default_text='New MT5 account(s) under the BVI jurisdiction will be created for future trades.' />
                            </Text>
                        </div>
                    </div>
                    <div className='mt5-migration-modal__existing-accounts-card'>
                        <div className='mt5-migration-modal__existing-accounts-card-content'>
                            <Text weight='bold'>
                                <Localize i18n_default_text='If you have open positions' />
                            </Text>

                            <Text as='p' size='xs'>
                                <Localize i18n_default_text='Your funds will remain in your existing MT5 account(s).' />
                            </Text>

                            <Text as='p' size='xs'>
                                <Localize i18n_default_text='You can continue trading on your existing MT5 account(s) until you close all open positions.' />
                            </Text>

                            <Text as='p' size='xs'>
                                <Localize i18n_default_text='New MT5 account(s) under the BVI jurisdiction will be created for future trades.' />
                            </Text>
                        </div>
                    </div>
                </div>
                <div>
                    <div className=' mt5-migration-modal__existing-accounts-card-content'>
                        <Checkbox
                            value={is_checked}
                            onChange={() => setIsChecked(true)}
                            label={
                                <Text as='p' size={'xs'} line_height='xs'>
                                    <Localize
                                        i18n_default_text='I agree to move my MT5 account(s) and agree to Deriv BVI Ltd’s <0>terms and conditions</0>'
                                        components={[
                                            <StaticUrl key={0} className='link' href={'tnc/deriv-(bvi)-ltd.pdf'} />,
                                        ]}
                                    />
                                </Text>
                            }
                            defaultChecked={!!is_checked}
                        />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );

    React.useEffect(() => {
        if (svg_accounts_to_migrate.length) {
            toggleMT5MigrationModal();
        }
    }, []);

    const onConfirmMigration = () => {
        toggleMT5MigrationModal();
        openPasswordModal({ category: 'real', type: 'financial' });
    };

    return (
        <div>
            <React.Suspense fallback={<UILoader />}>
                <Modal
                    className='mt5-migration-modal'
                    disableApp={disableApp}
                    enableApp={enableApp}
                    exit_classname='cfd-modal--custom-exit'
                    is_open={is_mt5_migration_modal_open}
                    title={modal_title}
                    toggleModal={toggleMT5MigrationModal}
                    width='58.8rem'
                    height={
                        show_modal_front_side ? (no_of_svg_accounts_to_migrate < 1 ? '54.2rem' : '44rem') : '61.6rem'
                    }
                >
                    {show_modal_front_side ? <ShowFrontSide /> : <ShowBackSide />}

                    {show_modal_front_side ? (
                        <Modal.Footer has_separator>
                            <Button type='button' large primary onClick={() => setShowModalFrontSide(false)}>
                                Next
                            </Button>
                        </Modal.Footer>
                    ) : (
                        <Modal.Footer has_separator>
                            <Button type='button' large secondary onClick={() => setShowModalFrontSide(true)}>
                                Back
                            </Button>

                            <Button type='button' large primary onClick={onConfirmMigration}>
                                Next
                            </Button>
                        </Modal.Footer>
                    )}
                </Modal>
            </React.Suspense>
        </div>
    );
});

export default MT5MigrationModal;
