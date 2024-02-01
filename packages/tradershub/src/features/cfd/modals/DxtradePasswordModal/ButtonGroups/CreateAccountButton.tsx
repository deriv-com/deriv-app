import React from 'react';
import { Button } from '@deriv-com/ui';
import useDxtradeAccountHandler from '../../../../../hooks/useDxtradeAccountHandler';
import { validPassword } from '../../../../../utils/password';

type TCreateAccountButtonProps = {
    buttonText: string;
    password: string;
};

const CreateAccountButton = ({ buttonText, password }: TCreateAccountButtonProps) => {
    const { createDxtradeAccountLoading, handleSubmit } = useDxtradeAccountHandler();

    return (
        <Button
            disabled={!password || createDxtradeAccountLoading || !validPassword(password)}
            isFullWidth
            isLoading={createDxtradeAccountLoading}
            onClick={() => handleSubmit(password)}
            size='lg'
        >
            {buttonText}
        </Button>
    );
};

export default CreateAccountButton;
