import PropTypes        from 'prop-types';
import React            from 'react';
import { connect }      from '../stores/connect';
import                       '../assets/sass/scratch/_flyout.scss';

class Flyout extends React.PureComponent {
    render() {
        const {
            is_visible,
            toolbox_bounds,
            flyout_width,
            flyout_content,
        } = this.props;

        return (
            <div
                ref={node => this.node = node}
                className={`flyout${!is_visible ? ' flyout--hidden' : ''}`}
                style={{
                    left : `${toolbox_bounds.width}px`,
                    top  : `${toolbox_bounds.top}px`,
                    width: `${flyout_width}px`,
                }}
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
    setVisibility : PropTypes.func,
    toolbox_bounds: PropTypes.object,
};

export default connect(({ flyout }) => ({
    toolbox_bounds: flyout.toolbox_bounds,
    flyout_width  : flyout.flyout_width,
    flyout_content: flyout.flyout_content,
    is_visible    : flyout.is_visible,
    setVisibility : flyout.setVisibility,
}))(Flyout);

