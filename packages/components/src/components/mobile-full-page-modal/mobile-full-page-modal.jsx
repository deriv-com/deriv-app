import React from 'react';
import classNames from 'classnames';
import Div100vhContainer from '../div100vh-container';
import FadeWrapper from '../fade-wrapper';
import PageOverlay from '../page-overlay';

const MobileFullPageModal = ({ children, className, header, is_modal_open, onClickClose, offset = '0px' }) => {
    return (
        <FadeWrapper
            is_visible={is_modal_open}
            className={classNames('dc-mobile-full-page-modal', `${className}__wrapper`)}
            keyname={`${className}__wrapper`}
        >
            <PageOverlay header={header} onClickClose={onClickClose}>
                <Div100vhContainer className={`dc-mobile-full-page-modal--is-mobile`} height_offset={offset}>
                    {children}
                </Div100vhContainer>
            </PageOverlay>
        </FadeWrapper>
    );
};

export default MobileFullPageModal;
