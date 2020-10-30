import React from 'react';
import classNames from 'classnames';
import Div100vhContainer from '../div100vh-container';
import FadeWrapper from '../fade-wrapper';
import PageOverlay from '../page-overlay/page-overlay.jsx';

const MobileFullPageModal = ({
    children,
    className,
    header,
    height_offset = '0px',
    is_flex,
    is_modal_open,
    onClickClose,
}) => (
    <FadeWrapper
        is_visible={is_modal_open}
        className={classNames('dc-mobile-full-page-modal', `${className}__wrapper`)}
        keyname={`${className}__wrapper`}
    >
        <PageOverlay header={header} onClickClose={onClickClose}>
            <Div100vhContainer
                className={classNames('dc-mobile-full-page-modal', {
                    'dc-mobile-full-page-modal--flex': is_flex,
                })}
                height_offset={height_offset}
            >
                {children}
            </Div100vhContainer>
        </PageOverlay>
    </FadeWrapper>
);

export default MobileFullPageModal;
