import React from 'react';
import { useHistory } from 'react-router';
import ReactDOM from 'react-dom';
import { Text } from '@deriv/components';
import { routes } from '@deriv/shared';
import { Localize } from '@deriv/translations';

const EffortlessLoginModalWrapper = ({ children }: React.PropsWithChildren) => {
    const portal_element = document.getElementById('modal_root_absolute');
    const history = useHistory();

    if (!portal_element) return null;
    return ReactDOM.createPortal(
        <div className={'effortless-login-modal__overlay-container'}>
            <Text
                as='div'
                size='xxs'
                color='loss-danger'
                weight='bold'
                line_height='xl'
                align='right'
                className='effortless-login-modal__overlay-header'
                onClick={() => {
                    localStorage.setItem('show_effortless_login_modal', JSON.stringify(false));
                    history.push(routes.traders_hub);
                }}
            >
                <Localize i18n_default_text='Maybe later' />
            </Text>
            {children}
        </div>,
        portal_element
    );
};

export default EffortlessLoginModalWrapper;
