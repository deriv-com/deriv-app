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

const MT5MigrationModal = observer(() => {
    const { traders_hub, ui } = useStore();

    const { disableApp, enableApp } = ui;

    const modal_title = <Localize i18n_default_text='Enhancing your trading experience' />;
    return (
        <div>
            <React.Suspense fallback={<UILoader />}>
                {/* <DesktopWrapper> */}
                <Modal
                    className='mt5-migration-modal'
                    disableApp={disableApp}
                    enableApp={enableApp}
                    exit_classname='cfd-modal--custom-exit'
                    is_open={true}
                    title={modal_title}
                    width='58.8rem'
                    height='54.2rem'
                >
                    {/* <Modal.Body> */}
                    <div>
                        <div className='mt5-migration-modal__description'>
                            <Text as='p' color='general' size='s' align='center'>
                                <Localize i18n_default_text='We’re upgrading your SVG account(s) by moving them to the BVI jurisdiction.' />
                            </Text>
                        </div>
                        <div className='mt5-migration-modal__migration_content'>
                            <div className='mt5-migration-modal__migration_content-items'>
                                {/* <Icon icon='IcMt5SvgDerived' height={99} width={96} />
                                <Icon icon='IcLongArrowRight' height={24} width={24} />
                                <Icon icon='IcMt5BviDerived' height={99} width={96} /> */}

                                <Icon icon='IcMt5SvgDerived' height={99} width={96} />
                                <Icon icon='IcLongArrowRight' height={24} width={24} />
                                <Icon icon='IcMt5VanuatuDerived' height={99} width={96} />
                            </div>
                            <div className='mt5-migration-modal__migration_content-items'>
                                {/* <Icon icon='IcMt5SvgDerived' height={99} width={96} />
                                <Icon icon='IcLongArrowRight' height={24} width={24} />
                                <Icon icon='IcMt5BviDerived' height={99} width={96} /> */}
                                <Icon icon='IcMt5SvgFinancial' height={99} width={96} />
                                <Icon icon='IcLongArrowRight' height={24} width={24} />
                                <Icon icon='IcMt5VanuatuFinancial' height={99} width={96} />
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
