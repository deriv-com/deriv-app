import React            from 'react';
import PropTypes        from 'prop-types';
import { connect }      from '../stores/connect';
import                       '../assets/sass/scratch/_flyout.scss';

class Flyout extends React.PureComponent {
    render() {
        const { is_visible, flyout_width, flyout_content } = this.props;

        return (
            <div
                ref={node => this.node = node}
                className={`flyout${!is_visible ? ' flyout--hidden' : ''}`}
                style={{ width: `${flyout_width}px` }}
            >
                { flyout_content }
            </div>
        );
    }
}

Flyout.propTypes = {
    flyout_content: PropTypes.array,
    flyout_width  : PropTypes.number,
    is_visible    : PropTypes.bool,
};

export default connect(({ flyout }) => ({
    flyout_content: flyout.flyout_content,
    flyout_width  : flyout.flyout_width,
    is_visible    : flyout.is_visible,
}))(Flyout);

