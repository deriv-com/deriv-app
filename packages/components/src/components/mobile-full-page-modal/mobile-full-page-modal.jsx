import PropTypes from 'prop-types';
import * as React from 'react';
import classNames from 'classnames';
import Div100vhContainer from '../div100vh-container';
import FadeWrapper from '../fade-wrapper';
import PageOverlay from '../page-overlay/page-overlay.jsx';
import Text from '../text/text';
import Icon from '../icon/icon';

const MobileFullPageModal = ({
    body_className,
    className,
    should_header_stick_body,
    header,
    header_background_color,
    height_offset = '0px',
    is_flex,
    is_popup,
    is_modal_open,
    onClickClose,
    renderPageFooterChildren,
    page_footer_className,
    page_footer_parent,
    page_footer_parent_className,
    page_header_className,
    page_header_text,
    renderPageHeaderTrailingIcon,
    pageHeaderReturnFn,
    renderPageHeader,
    renderPageHeaderText,
    // opt-in for backward compatibility.
    children,
    container_children,
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
                    'dc-mobile-full-page-modal--popup': is_popup,
                })}
                height_offset={height_offset}
            >
                {(renderPageHeader || page_header_text || renderPageHeaderText) && (
                    <div
                        className={classNames('dc-mobile-full-page-modal__header', {
                            'dc-mobile-full-page-modal__header--border-bottom': !should_header_stick_body,
                            [page_header_className]: !!page_header_className,
                        })}
                        style={{
                            background: header_background_color,
                        }}
                    >
                        {pageHeaderReturnFn && (
                            <div className='dc-mobile-full-page-modal__header-return'>
                                <Icon icon='IcArrowLeftBold' onClick={pageHeaderReturnFn} size={16} />
                            </div>
                        )}
                        {renderPageHeader && renderPageHeader()}
                        <div className='dc-mobile-full-page-modal__header-text'>
                            {renderPageHeaderText ? (
                                renderPageHeaderText()
                            ) : (
                                <Text as='p' color='prominent' line_height='m' size='s' weight='bold'>
                                    {page_header_text}
                                </Text>
                            )}
                        </div>
                        {renderPageHeaderTrailingIcon && (
                            <div className='dc-mobile-full-page-modal__header-trailing-icon'>
                                {renderPageHeaderTrailingIcon()}
                            </div>
                        )}
                    </div>
                )}
                <div className={classNames('dc-mobile-full-page-modal__body', body_className)}>{children}</div>
                {renderPageFooterChildren && (
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
                            {renderPageFooterChildren()}
                        </div>
                    </React.Fragment>
                )}
                {container_children}
            </Div100vhContainer>
        </PageOverlay>
    </FadeWrapper>
);

MobileFullPageModal.propTypes = {
    className: PropTypes.string,
    container_children: PropTypes.any,
    header: PropTypes.string,
    header_background_color: PropTypes.string,
    height_offset: PropTypes.string,
    is_flex: PropTypes.bool,
    is_modal_open: PropTypes.bool,
    onClickClose: PropTypes.func,
    pageHeaderReturnFn: PropTypes.func,
    renderPageFooterChildren: PropTypes.func,
    page_footer_className: PropTypes.string,
    page_header_className: PropTypes.string,
    page_header_text: PropTypes.string,
    renderPageHeaderTrailingIcon: PropTypes.func,
    renderPageHeaderText: PropTypes.func,
    should_header_stick_body: PropTypes.bool,
    should_wrap_body: PropTypes.bool,
    body_className: PropTypes.string,
    is_popup: PropTypes.bool,
    page_footer_parent: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
    children: PropTypes.oneOfType([PropTypes.arrayOf, PropTypes.node]),
    renderPageHeader: PropTypes.func,
    page_footer_parent_className: PropTypes.string,
};

export default MobileFullPageModal;
