import React from 'react';
import { Button } from '@deriv/components';
import { Localize } from 'Components/i18next';
import './business-hour-modal-footer.scss';

type TBusinessHourModalFooter = {
    is_disabled?: boolean;
    onClickCancel: () => void;
    onClickSave: () => void;
    setShowEdit: (show_edit: boolean) => void;
    show_edit: boolean;
};

const BusinessHourModalFooter = ({
    is_disabled,
    onClickCancel,
    onClickSave,
    setShowEdit,
    show_edit,
}: TBusinessHourModalFooter) => {
    if (show_edit) {
        return (
            <div className='business-hour-modal-footer__buttons'>
                <Button className='business-hour-modal-footer__button' secondary onClick={onClickCancel} large>
                    <Localize i18n_default_text='Cancel' />
                </Button>
                <Button
                    className='business-hour-modal-footer__button'
                    primary
                    large
                    onClick={onClickSave}
                    disabled={is_disabled}
                >
                    <Localize i18n_default_text='Save' />
                </Button>
            </div>
        );
    }

    return (
        <Button className='business-hour-modal-footer__button' secondary onClick={() => setShowEdit(true)} large>
            <Localize i18n_default_text='Edit business hours' />
        </Button>
    );
};

export default BusinessHourModalFooter;
