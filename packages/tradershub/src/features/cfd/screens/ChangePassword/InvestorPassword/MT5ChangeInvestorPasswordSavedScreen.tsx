import React from 'react';
import { Button, Text } from '@deriv-com/ui';
import { ActionScreen } from '../../../../../components';
import MT5PasswordUpdatedIcon from '../../../../../public/images/ic-mt5-password-updated.svg';

type TMT5ChangeInvestorPasswordSavedScreen = {
    setNextScreen?: VoidFunction;
};

const MT5ChangeInvestorPasswordSavedScreen = ({ setNextScreen }: TMT5ChangeInvestorPasswordSavedScreen) => {
    return (
        <ActionScreen
            description={
                <Text align='center' size='sm'>
                    Your investor password has been changed.
                </Text>
            }
            descriptionSize='sm'
            icon={<MT5PasswordUpdatedIcon />}
            renderButtons={() => (
                <Button onClick={setNextScreen} size='lg'>
                    Okay
                </Button>
            )}
            title='Password saved'
        />
    );
};

export default MT5ChangeInvestorPasswordSavedScreen;
