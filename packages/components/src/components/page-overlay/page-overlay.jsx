import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'Components/icon/icon.jsx';

class PageOverlay extends React.Component {
    render() {
        const { children, header, onClickClose } = this.props;

        return (
            <div className='dc-page-overlay'>
                {header && (
                    <div className='dc-page-overlay__header'>
                        <div className='dc-page-overlay__header-wrapper'>
                            <div className='dc-page-overlay__header-title'>{header}</div>
                            <div
                                className='dc-page-overlay__header-close'
                                onClick={onClickClose || window.history.back}
                            >
                                <Icon icon='IcCross' />
                            </div>
                        </div>
                    </div>
                )}
                <div className='dc-page-overlay__content'>{children}</div>
            </div>
        );
    }
}

PageOverlay.defaultProps = {
    has_side_note: false,
};

PageOverlay.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    onClickClose: PropTypes.func,
};

export default PageOverlay;
