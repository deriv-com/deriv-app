import React     from 'react';
import PropTypes from 'prop-types';
import Icon      from '../icon';

class PageOverlay extends React.Component {
    render() {
        const {
            children,
            header,
            onClickClose,
            has_side_note, // This is currently set to false by default and is used to create the 3-column placeholder setup
            // side_note, // Enable this once there is a use for it and pass it inside `.dc-page-overlay__content-side-note` and use it as the flag instead of `has_side_note`
        } = this.props;

        return (
            <div className='dc-page-overlay'>
                { header &&
                    <div className='dc-page-overlay__header'>
                        <div className='dc-page-overlay__header-wrapper'>
                            <div className='dc-page-overlay__header-title'>
                                { header }
                            </div>
                            <div
                                className='dc-page-overlay__header-close'
                                onClick={onClickClose || window.history.back}
                            >
                                <Icon icon='IcCross' />
                            </div>
                        </div>
                    </div>
                }
                <div className='dc-page-overlay__content'>
                    { children }
                    { has_side_note &&
                        <div className='dc-page-overlay__content-side-note' />
                    }
                </div>
            </div>
        );
    }
}

PageOverlay.defaultProps = {
    has_side_note: false,
};

PageOverlay.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
    header: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    onClickClose: PropTypes.func,
};

export default PageOverlay;
