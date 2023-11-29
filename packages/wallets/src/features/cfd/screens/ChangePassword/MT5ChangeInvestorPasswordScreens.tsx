import React, { ErrorInfo, useEffect, useState } from 'react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useTradingPlatformInvestorPasswordChange } from '@deriv/api';
import {
    SentEmailContent,
    WalletButton,
    WalletPasswordField,
    WalletsActionScreen,
    WalletText,
} from '../../../../components';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import MT5PasswordUpdatedIcon from '../../../../public/images/ic-mt5-password-updated.svg';
import { validPassword } from '../../../../utils/passwordUtils';

type TChangeInvestorPasswordScreenIndex = 'emailVerification' | 'introScreen' | 'savedScreen';
// type TFormValues = Record<'new_password' | 'old_password', string>;

const MT5ChangeInvestorPasswordScreens = () => {
    const [currentInvestorPassword, setCurrentInvestorPassword] = useState('');
    const [newInvestorPassword, setNewInvestorPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [activeScreen, setActiveScreen] = useState<TChangeInvestorPasswordScreenIndex>('introScreen');
    const handleClick = (nextScreen: TChangeInvestorPasswordScreenIndex) => setActiveScreen(nextScreen);

    const { isMobile } = useDevice();
    const { hide } = useModal();

    const {
        error: changeInvestorPasswordError,
        mutateAsync: changeInvestorPassword,
        status: changeInvestorPasswordStatus,
    } = useTradingPlatformInvestorPasswordChange();

    // console.log('changeInvestorPasswordError = ', changeInvestorPasswordError);
    // console.log('changeInvestorPasswordStatus = ', changeInvestorPasswordStatus);

    const initialValues = { currentPassword: '', newPassword: '' };

    const onSubmitHandler = () => {};

    const onChangeButtonClickHandler = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();

        // try {
        setErrorMessage('');
        await changeInvestorPassword({
            account_id: 'MT2142',
            new_password: newInvestorPassword,
            old_password: currentInvestorPassword,
            platform: 'mt5',
        });
        handleClick('savedScreen');
        // } catch (error) {
        //     console.log('error = ', error, ', changeInvestorPasswordError = ', changeInvestorPasswordError);
        //     setErrorMessage(error.error?.message);
        // }
    };

    // useEffect(() => {
    //     if (changeInvestorPasswordError) setErrorMessage(changeInvestorPasswordError?.error?.message);
    //     else setErrorMessage('');
    // }, [changeInvestorPasswordError]);

    const ChangeInvestorPasswordScreens = {
        introScreen: {
            bodyText: (
                <>
                    <WalletText size='sm'>
                        Use this password to grant viewing access to another user. While they may view your trading
                        account, they will not be able to trade or take any other actions.
                    </WalletText>
                    <WalletText size='sm'>
                        If this is the first time you try to create a password, or you have forgotten your password,
                        please reset it.
                    </WalletText>
                    {errorMessage && (
                        <WalletText align='center' color='error' size='sm'>
                            {/* {changeInvestorPasswordError?.error?.message} */}
                            {errorMessage}
                        </WalletText>
                    )}
                </>
            ),
            button: (
                <form className='wallets-change-password__investor-password'>
                    <div className='wallets-change-password__investor-password-fields'>
                        <WalletPasswordField
                            autoComplete='new-password'
                            label='Current investor password'
                            name='currentPassword'
                            onChange={e => setCurrentInvestorPassword(e.target.value)}
                            password={currentInvestorPassword}
                        />
                        <WalletPasswordField
                            autoComplete='new-password'
                            label='New investor password'
                            name='newPassword'
                            onChange={e => setNewInvestorPassword(e.target.value)}
                            password={newInvestorPassword}
                        />
                        <input autoComplete='username' hidden name='username' type='text' />
                    </div>
                    <div className='wallets-change-password__investor-password-buttons'>
                        <WalletButton
                            disabled={!validPassword(newInvestorPassword) || !validPassword(newInvestorPassword)}
                            isLoading={changeInvestorPasswordStatus === 'loading'}
                            onClick={onChangeButtonClickHandler}
                            size={isMobile ? 'lg' : 'md'}
                            text='Change investor password'
                        />
                        <WalletButton
                            onClick={() => handleClick('emailVerification')}
                            size={isMobile ? 'lg' : 'md'}
                            text='Create or reset investor password'
                            variant='ghost'
                        />
                    </div>
                </form>
            ),
            headingText: undefined,
            icon: undefined,
        },
        savedScreen: {
            bodyText: (
                <WalletText align='center' size='sm'>
                    Your investor password has been changed.
                </WalletText>
            ),
            button: <WalletButton onClick={() => hide()} size='lg' text='Okay' />,
            headingText: 'Password saved',
            icon: <MT5PasswordUpdatedIcon />,
        },
    };

    if (activeScreen === 'emailVerification')
        return (
            <div className='wallets-change-password__sent-email-wrapper'>
                <SentEmailContent description='Please click on the link in the email to reset your password.' />
            </div>
        );

    return (
        <div className='wallets-change-password__content'>
            <WalletsActionScreen
                description={ChangeInvestorPasswordScreens[activeScreen].bodyText}
                descriptionSize='sm'
                icon={ChangeInvestorPasswordScreens[activeScreen].icon}
                renderButtons={() => ChangeInvestorPasswordScreens[activeScreen].button}
                title={ChangeInvestorPasswordScreens[activeScreen].headingText}
            />
        </div>
    );
};

export default MT5ChangeInvestorPasswordScreens;
