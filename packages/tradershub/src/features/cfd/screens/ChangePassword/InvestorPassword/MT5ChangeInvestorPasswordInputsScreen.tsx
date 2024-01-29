import React, { Fragment } from 'react';
import { Formik } from 'formik';
import { useTradingPlatformInvestorPasswordChange } from '@deriv/api';
import { Button, Text, TextField, useBreakpoint } from '@deriv/quill-design';
import { ActionScreen } from '../../../../../components';
import { Provider } from '@deriv/library';
import { PlatformDetails } from '../../../constants';

type TFormInitialValues = {
    currentPassword: string;
    newPassword: string;
};

type TMT5ChangeInvestorPasswordInputsScreen = {
    sendEmail?: VoidFunction;
    setNextScreen?: VoidFunction;
};

const MT5ChangeInvestorPasswordInputsScreen = ({
    sendEmail,
    setNextScreen,
}: TMT5ChangeInvestorPasswordInputsScreen) => {
    const { isMobile } = useBreakpoint();
    const { getCFDState } = Provider.useCFDContext();
    const mt5AccountId = getCFDState('accountId') ?? '';

    const {
        error: changeInvestorPasswordError,
        mutateAsync: changeInvestorPassword,
        status: changeInvestorPasswordStatus,
    } = useTradingPlatformInvestorPasswordChange();

    const initialValues: TFormInitialValues = { currentPassword: '', newPassword: '' };

    const onChangeButtonClickHandler = async (values: TFormInitialValues) => {
        await changeInvestorPassword({
            account_id: mt5AccountId,
            new_password: values.newPassword,
            old_password: values.currentPassword,
            platform: PlatformDetails.mt5.platform,
        });
        setNextScreen?.();
    };

    const FormInputs = () => (
        <Formik initialValues={initialValues} onSubmit={onChangeButtonClickHandler}>
            {({ handleChange, handleSubmit, values }) => (
                <form className='flex flex-col content-center gap-1200' onSubmit={handleSubmit}>
                    <div className='flex flex-col content-center gap-800 w-[328px]'>
                        <TextField
                            autoComplete='current-password'
                            className='border-solid rounded-200 border-xs border-system-light-active-background text-75 h-2000'
                            label='Current investor password'
                            name='currentPassword'
                            onChange={handleChange}
                            value={values.currentPassword}
                        />
                        <TextField
                            autoComplete='new-password'
                            className='border-solid rounded-200 border-xs border-system-light-active-background text-75 h-2000'
                            label='New investor password'
                            name='newPassword'
                            onChange={handleChange}
                            value={values.newPassword}
                        />
                    </div>
                    <div className='flex flex-col content-center gap-800'>
                        <Button
                            // quill component issue, add type submit and disabled once the proper component is ready

                            isLoading={changeInvestorPasswordStatus === 'loading'}
                            size={isMobile ? 'lg' : 'md'}
                        >
                            Change investor password
                        </Button>
                        <Button
                            className='border-none'
                            colorStyle='coral'
                            onClick={sendEmail}
                            size={isMobile ? 'lg' : 'md'}
                            variant='secondary'
                        >
                            Create or reset investor password
                        </Button>
                    </div>
                </form>
            )}
        </Formik>
    );

    return (
        <ActionScreen
            description={
                <Fragment>
                    <Text size='sm'>
                        Use this password to grant viewing access to another user. While they may view your trading
                        account, they will not be able to trade or take any other actions.
                    </Text>
                    <Text size='sm'>
                        If this is the first time you try to create a password, or you have forgotten your password,
                        please reset it.
                    </Text>
                    {changeInvestorPasswordError && (
                        <Text align='center' color='error' size='sm'>
                            {changeInvestorPasswordError?.error?.message}
                        </Text>
                    )}
                </Fragment>
            }
            descriptionSize='sm'
            renderButtons={() => <FormInputs />}
        />
    );
};

export default MT5ChangeInvestorPasswordInputsScreen;
