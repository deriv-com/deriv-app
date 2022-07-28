import { Button, FormSubmitButton, MobileDialog, MobileWrapper, Modal, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import React from 'react';

const TestWarningModal = ({ show_risk_modal, onAccept, onDecline }) => {
    if (isMobile()) {
        return (
            <MobileWrapper>
                <MobileDialog
                    wrapper_classname='test-warning'
                    portal_element_id='modal_root'
                    visible={show_risk_modal}
                    title={localize('Appropriateness Test Warning')}
                    has_close_icon={false}
                >
                    <Text as='p' size='xs'>
                        <Localize i18n_default_text='In providing our services to you, we are required to obtain information from you in order to assess whether a given product or service is appropriate for you and whether you possess the experience and knowledge to understand the risks involved.' />
                    </Text>
                    <Text as='p' size='xs'>
                        <Localize
                            i18n_default_text='<0/>On the basis of the information provided in relation to your knowledge and experience, we consider that the investments available via this website are not appropriate for you.<0/><0/>'
                            components={[<br key={0} />]}
                        />
                    </Text>
                    <Text as='p' size='xs'>
                        <Localize i18n_default_text='By clicking ‘Accept’ and proceeding with the account opening, you should note that you may be exposing yourself to risks. These risks, which may be significant, include the risk of losing the entire sum invested, and you may not have the knowledge and experience to properly assess or mitigate them.' />
                    </Text>
                    <FormSubmitButton
                        label={localize('Accept')}
                        onClick={onAccept}
                        is_absolute
                        has_cancel
                        cancel_label={localize('Decline')}
                        onCancel={onDecline}
                    />
                </MobileDialog>
            </MobileWrapper>
        );
    }

    return (
        <Modal
            width='44rem'
            has_close_icon={false}
            title={localize('Appropriateness Test Warning')}
            is_open={show_risk_modal}
            className='risk-tolerance'
        >
            <Modal.Body>
                <Text as='p' size='xs'>
                    <Localize i18n_default_text='In providing our services to you, we are required to obtain information from you in order to assess whether a given product or service is appropriate for you and whether you possess the experience and knowledge to understand the risks involved.' />
                </Text>
                <Text as='p' size='xs'>
                    <Localize
                        i18n_default_text='<0/>On the basis of the information provided in relation to your knowledge and experience, we consider that the investments available via this website are not appropriate for you.<0/><0/>'
                        components={[<br key={0} />]}
                    />
                </Text>
                <Text as='p' size='xs'>
                    <Localize i18n_default_text='By clicking ‘Accept’ and proceeding with the account opening, you should note that you may be exposing yourself to risks. These risks, which may be significant, include the risk of losing the entire sum invested, and you may not have the knowledge and experience to properly assess or mitigate them.' />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button type='button' large text={localize('Decline')} secondary onClick={onDecline} />
                <Button type='button' large text={localize('Accept')} primary onClick={onAccept} />
            </Modal.Footer>
        </Modal>
    );
};

// export default connect(({ ui }) => ({
//     real_account_signup_data: ui.real_account_signup_data,
// }))(TestWarningModal);

export default TestWarningModal;
