import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { saveBeforeUnload } from '../../../../blockly/utils';
import { setIsHeaderLoaded } from '../../../store/ui-slice';
import Tour, { TourTargets } from '../../../components/tour';
import config from '../../../../../../app.config';

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
                {config.login.label}
            </button>
            <a
                id='btn__signup'
                className='btn btn--primary header__btn-signup'
                target='_blank'
                rel='noopener noreferrer'
                href={config.signup.url}
            >
                {config.signup.label}
            </a>
            <TourTargets />
            <Tour />
        </div>
    );
};

export default AuthButtons;
