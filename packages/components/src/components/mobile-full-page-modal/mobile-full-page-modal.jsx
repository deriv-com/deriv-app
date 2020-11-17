import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import Div100vhContainer from '../div100vh-container';
import FadeWrapper from '../fade-wrapper';
import PageOverlay from '../page-overlay/page-overlay.jsx';
import Icon from '../icon/icon.jsx';
import Text from '../text/text.jsx';

const MobileFullPageModalBodyWrapper = ({ className, children, should_wrap_body }) => {
    if (should_wrap_body) {
        return <div className={classNames('dc-mobile-full-page-modal__body', className)}>{children}</div>;
    }

    return children;
};

const MobileFullPageModal = ({
    body_className,
    className,
    header,
    height_offset = '0px',
    is_flex,
    is_modal_open,
    onClickClose,
    page_footer_children,
    page_footer_className,
    page_footer_parent,
    page_footer_parent_className,
    page_header_className,
    page_header_text,
    page_header_trailing_icon,
    pageHeaderReturnFn,
    renderPageHeaderText,
    should_wrap_body, // opt-in for backward compatibility.
    children,
}) => (
    <FadeWrapper
        is_visible={is_modal_open}
        className={classNames('dc-mobile-full-page-modal', className)}
        keyname={`${className}__wrapper`}
    >
        <PageOverlay header={header} onClickClose={onClickClose}>
            <Div100vhContainer
                className={classNames('dc-mobile-full-page-modal', {
                    'dc-mobile-full-page-modal--flex': is_flex,
                })}
                height_offset={height_offset}
            >
                {(page_header_text || renderPageHeaderText) && (
                    <div className={classNames('dc-mobile-full-page-modal__header', page_header_className)}>
                        {pageHeaderReturnFn && (
                            <div className='dc-mobile-full-page-modal__header-return'>
                                <Icon icon='IcArrowLeftBold' onClick={pageHeaderReturnFn} size={16} />
                            </div>
                        )}
                        <div className='dc-mobile-full-page-modal__header-text'>
                            {renderPageHeaderText ? (
                                renderPageHeaderText()
                            ) : (
                                <Text as='p' color='prominent' line_height='m' size='s' weight='bold'>
                                    {page_header_text}
                                </Text>
                            )}
                        </div>
                        {page_header_trailing_icon && (
                            <div className='dc-mobile-full-page-modal__header-trailing-icon'>
                                {page_header_trailing_icon}
                            </div>
                        )}
                    </div>
                )}
                <MobileFullPageModalBodyWrapper className={body_className} should_wrap_body={should_wrap_body}>
                    {children}
                </MobileFullPageModalBodyWrapper>
                {page_footer_children && (
                    <React.Fragment>
                        {page_footer_parent && (
                            <div
                                className={classNames(
                                    'dc-mobile-full-page-modal__footer-parent',
                                    page_footer_parent_className
                                )}
                            >
                                {page_footer_parent}
                            </div>
                        )}
                        <div className={classNames('dc-mobile-full-page-modal__footer', page_footer_className)}>
                            {page_footer_children}
                        </div>
                    </React.Fragment>
                )}
            </Div100vhContainer>
        </PageOverlay>
    </FadeWrapper>
);

MobileFullPageModal.propTypes = {
    className: PropTypes.string,
    header: PropTypes.string,
    height_offset: PropTypes.string,
    is_flex: PropTypes.bool,
    is_modal_open: PropTypes.bool,
    onClickClose: PropTypes.func,
    page_footer_children: PropTypes.any,
    page_footer_className: PropTypes.string,
    page_header_className: PropTypes.string,
    page_header_text: PropTypes.string,
    page_header_trailing_icon: PropTypes.any,
    pageHeaderReturnFn: PropTypes.func,
    renderPageHeaderText: PropTypes.func,
    should_wrap_body: PropTypes.bool,
};

export default MobileFullPageModal;
