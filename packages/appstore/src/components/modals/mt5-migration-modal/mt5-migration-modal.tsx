import React from 'react';
import {
    DesktopWrapper,
    MobileDialog,
    MobileWrapper,
    Modal,
    UILoader,
    Text,
    Icon,
    FormSubmitButton,
} from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
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

const MT5MigrationModal = observer(() => {
    const { ui } = useStore();
    const {
        no_of_svg_accounts_to_migrate,
        eligible_account_to_migrate,
        eligible_svg_to_bvi_derived_accounts,
        eligible_svg_to_bvi_financial_accounts,
        eligible_svg_to_vanuatu_derived_accounts,
        eligible_svg_to_vanuatu_financial_accounts,
    } = useMT5SVGEligibleToMigrate();

    const { disableApp, enableApp, is_mt5_migration_modal_open } = ui;

    const modal_title = <Localize i18n_default_text='Enhancing your trading experience' />;
    return (
        <div>
            <React.Suspense fallback={<UILoader />}>
                <Modal
                    className='mt5-migration-modal'
                    disableApp={disableApp}
                    enableApp={enableApp}
                    exit_classname='cfd-modal--custom-exit'
                    is_open={true}
                    title={modal_title}
                    width='58.8rem'
                    height={no_of_svg_accounts_to_migrate < 1 ? '54.2rem' : '44rem'}
                >
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
                                {eligible_svg_to_vanuatu_derived_accounts && (
                                    <MigrateAccount to='vanuatu' type='derived' />
                                )}
                                {eligible_svg_to_vanuatu_financial_accounts && (
                                    <MigrateAccount to='vanuatu' type='financial' />
                                )}
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
                    {/* </Modal.Body> */}
                    <Modal.Footer has_separator>
                        <FormSubmitButton
                            // is_disabled={isSubmitDisabled(errors)}
                            label={localize('Next')}
                            // is_absolute={isMobile()}
                        />
                    </Modal.Footer>
                </Modal>
                {/* </DesktopWrapper> */}
                {/* <MobileWrapper>
                    <MobileDialog portal_element_id='deriv_app' title={'modal_title'} visible={true}>
                        <div>Test</div>
                    </MobileDialog>
                </MobileWrapper> */}
            </React.Suspense>
        </div>
    );
});

export default MT5MigrationModal;
