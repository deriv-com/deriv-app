import React from 'react';
import { Button } from '@deriv/components';
import FormFooter from '../../../../Components/form-footer';

type TPasskeysFooterButtons = {
    button_text: React.ReactElement;
    onButtonClick: () => void;
    back_button_text?: React.ReactElement;
    onBackButtonClick?: () => void;
};

const PasskeysFooterButtons = ({
    button_text,
    onButtonClick,
    back_button_text,
    onBackButtonClick,
}: TPasskeysFooterButtons) => {
    return (
        <FormFooter className='passkeys-status__footer'>
            {back_button_text && (
                <Button type='button' has_effect secondary onClick={onBackButtonClick}>
                    {back_button_text}
                </Button>
            )}
            <Button type='button' has_effect primary onClick={onButtonClick}>
                {button_text}
            </Button>
        </FormFooter>
    );
};

export default PasskeysFooterButtons;
