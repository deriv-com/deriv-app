import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import config from '@config';
import { translate } from '@i18n';
import { setIsHeaderLoaded } from '@redux-store/ui-slice';
import Tour, { TourTargets } from '@components/common/tour';
import { saveBeforeUnload } from '../../blockly/utils';

const AuthButtons = () => {
    const dispatch = useDispatch();

    const onLogin = () => {
        saveBeforeUnload();
        document.location = config.login.url;
    };

    useEffect(() => {
        dispatch(setIsHeaderLoaded(true));
    }, []);

    return (
        <div className='header__btn'>
            <button id='btn__login' className='btn btn--tertiary header__btn-login' onClick={onLogin}>
                {translate(config.login.label)}
            </button>
            <a
                id='btn__signup'
                className='btn btn--primary header__btn-signup'
                target='_blank'
                rel='noopener noreferrer'
                href={config.signup.url}
            >
                {translate(config.signup.label)}
            </a>
            <TourTargets />
            <Tour />
        </div>
    );
};

export default AuthButtons;
