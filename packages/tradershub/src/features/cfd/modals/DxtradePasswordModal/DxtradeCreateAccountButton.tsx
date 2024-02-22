import React from 'react';
import { Button } from '@deriv-com/ui';
import useDxtradeAccountHandler from '../../../../hooks/useDxtradeAccountHandler';
import { validPassword } from '../../../../utils/password';

type TCreateAccountButtonProps = {
    buttonText: string;
    password: string;
};

const DxtradeCreateAccountButton = ({ buttonText, password }: TCreateAccountButtonProps) => {
    const { createDxtradeAccountLoading: isLoading, handleSubmit } = useDxtradeAccountHandler();
    const isDisabled = !password || isLoading || !validPassword(password);

    return (
        <Button
            disabled={isDisabled}
            isFullWidth
            isLoading={isLoading}
            onClick={() => handleSubmit(password)}
            size='lg'
        >
            {buttonText}
        </Button>
    );
};

export default DxtradeCreateAccountButton;
