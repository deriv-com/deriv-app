import { useState } from 'react';

import { Button, Modal, Text } from '@deriv/components';
import { useResidenceList } from '@deriv/hooks';
import { DerivLightUserErrorIcon, StandaloneCheckFillIcon } from '@deriv/quill-icons';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';

import IcSuccessUserIcon from '../../../../Assets/SvgComponents/others/ic-user-success.svg';

import CompleteAccountSettings from './complete-account-settings';
import CompleteFinancialAssessment from './complete-financial-information';

import './complete-user-profile-modal.scss';

type TCompleteUserProfile = {
    show_missing_fa: boolean;
    missing_information_account_settings: boolean;
    no_currency: boolean;
};

const CompleteUserProfileModal = observer(
    ({ show_missing_fa, missing_information_account_settings, no_currency }: TCompleteUserProfile) => {
        const [is_showing_fa_form, setShowFAForm] = useState(false);
        const [is_showing_missing_info_form, setShowInfoForm] = useState(false);

        const { client, ui } = useStore();
        const { account_settings, residence, has_active_real_account } = client;
        const { is_complete_user_profile_modal_open, setShouldShowCompleteUserProfileModal } = ui;

        const { data: residenceList } = useResidenceList();

        const [initial_personal_missing] = useState(!!missing_information_account_settings);
        const [initial_fa_missing] = useState(!!show_missing_fa);
        const [personal_done, set_personal_done] = useState(!missing_information_account_settings);
        const [fa_done, set_fa_done] = useState(!show_missing_fa);

        const closeModalInfo = () => {
            // Child signals success
            setShowInfoForm(false);
            set_personal_done(true);
        };

        const closeModalFA = () => {
            // Child signals success
            setShowFAForm(false);
            set_fa_done(true);
        };

        if (is_showing_missing_info_form) {
            return (
                <Modal
                    is_open={is_showing_missing_info_form}
                    title={localize('Complete your profile')}
                    height='auto'
                    width='440px'
                    should_header_stick_body={true}
                    has_close_icon={false}
                    className='complete-user-profile-modal'
                >
                    <CompleteAccountSettings
                        account_settings={account_settings}
                        residence={residence}
                        noCurrency={no_currency}
                        onClose={closeModalInfo}
                    />
                </Modal>
            );
        }

        if (is_showing_fa_form) {
            return (
                <Modal
                    is_open={is_showing_fa_form}
                    title={localize('Complete financial assessment')}
                    height='auto'
                    width='440px'
                    should_header_stick_body={true}
                    has_close_icon={false}
                    className='complete-user-profile-modal'
                >
                    <CompleteFinancialAssessment
                        account_settings={account_settings}
                        residenceList={residenceList}
                        onClose={closeModalFA}
                    />
                </Modal>
            );
        }
        const ButtonOnClick = () => {
            const need_personal = !personal_done;
            const need_fa = !fa_done;
            if (need_personal && need_fa) {
                // Start with Account Settings
                setShowInfoForm(true);
                return;
            }
            if (need_personal) {
                setShowInfoForm(true);
                return;
            }
            if (need_fa && has_active_real_account) {
                setShowFAForm(true);
                return;
            }
            // All completed
            setShouldShowCompleteUserProfileModal(false);
        };

        const getButtonLabel = () => {
            if (initial_personal_missing || initial_fa_missing) {
                return 'Complete now';
            }
            if (!personal_done || !fa_done) {
                return 'Continue';
            }
            return 'Start';
        };

        return (
            <Modal
                is_open={is_complete_user_profile_modal_open && !is_showing_fa_form && !is_showing_missing_info_form}
                title=''
                height='auto'
                width='440px'
                should_header_stick_body={true}
                has_close_icon={false}
                className='complete-user-profile-modal'
            >
                <Modal.Body>
                    <div className='complete-user-profile-modal__icon'>
                        {!personal_done || !fa_done ? (
                            <DerivLightUserErrorIcon height='120px' width='120px' />
                        ) : (
                            <IcSuccessUserIcon />
                        )}
                    </div>
                    <div className='complete-user-profile-modal__title'>
                        {!personal_done || !fa_done ? (
                            <>
                                <Text size='xsm' weight='bold'>
                                    <Localize i18n_default_text='Complete your profile' />
                                </Text>
                                <Text size='s'>
                                    <Localize i18n_default_text='Provide the following:' />
                                </Text>
                            </>
                        ) : (
                            <>
                                <Text size='xsm' weight='bold'>
                                    <Localize i18n_default_text='All set' />
                                </Text>
                                <Text size='s' color='less-prominent'>
                                    <Localize i18n_default_text='Your details are up to date. You can now continue trading.' />
                                </Text>
                            </>
                        )}
                    </div>
                    <ul className='complete-user-profile-modal__list'>
                        {initial_personal_missing && (
                            <li className='complete-user-profile-modal__list-item'>
                                &bull;
                                <Text size='s' className='complete-user-profile-modal__list-item--text'>
                                    <Localize i18n_default_text='Personal details' />
                                </Text>
                                {personal_done && <StandaloneCheckFillIcon fill='#37b24d' iconSize='sm' />}
                            </li>
                        )}
                        {initial_fa_missing && (
                            <li className='complete-user-profile-modal__list-item'>
                                &bull;
                                <Text size='s' className='complete-user-profile-modal__list-item--text'>
                                    <Localize i18n_default_text='Financial assessment' />
                                </Text>
                                {fa_done && <StandaloneCheckFillIcon fill='#37b24d' iconSize='sm' />}
                            </li>
                        )}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button rounded wide primary onClick={ButtonOnClick}>
                        {getButtonLabel()}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
);

export default CompleteUserProfileModal;
