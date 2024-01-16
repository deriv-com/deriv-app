import React from 'react';
import { Text, Button } from '@deriv/quill-design';
import { ActionScreen } from '../../../../../components';
import MT5PasswordUpdatedIcon from '../../../../../public/images/ic-mt5-password-updated.svg';

type TProps = {
    setNextScreen?: VoidFunction;
};

const MT5ChangeInvestorPasswordSavedScreen: React.FC<TProps> = ({ setNextScreen }) => {
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
