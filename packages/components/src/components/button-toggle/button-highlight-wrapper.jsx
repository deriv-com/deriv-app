import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Highlight } from './button-highlight.jsx';

class HighlightWrapper extends React.PureComponent {
    state = {
        left: 0,
        width: 0,
    };

    componentDidMount() {
        const active_button_el = [...this.node.getElementsByClassName('dc-button-menu__button--active')][0];
        if (!this.node) return;
        this.updateHighlightPosition(active_button_el);
    }

    componentDidUpdate() {
        const active_button_el = [...this.node.getElementsByClassName('dc-button-menu__button--active')][0];
        if (active_button_el) {
            this.updateHighlightPosition(active_button_el);
        } else if (this.state.left !== 0) {
            this.resetHighlight(); // clear highlight when active element doesn't exist
        }
    }

    componentWillUnMount() {
        this.resetHighlight();
    }

    onClick = (e, buttonClick) => {
        if (!e.target) return;
        this.updateHighlightPosition(e.target.closest('button'));
        if (typeof buttonClick === 'function') {
            buttonClick();
        }
    };

    resetHighlight = () => {
        this.setState({ left: 0 });
    };

    updateHighlightPosition = el => {
        if (!el) return;
        const { offsetLeft: left } = el;
        if (this.state.left !== left) {
            this.setState({ left });
        }
    };

    render() {
        const { children, className, has_rounded_button, ...other_props } = this.props;
        const props = {
            className: classnames('dc-button-menu__wrapper', className),
            ...other_props,
        };
        const button_width = (100 / children.length).toFixed(2);

        return (
            <div ref={node => (this.node = node)} {...props}>
                {React.Children.map(children, child =>
                    React.cloneElement(child, {
                        onClick: e => this.onClick(e, child.props.onClick),
                    })
                )}
                <Highlight left={this.state.left} width={`${button_width}%`} has_rounded_button={has_rounded_button} />
            </div>
        );
    }
}

HighlightWrapper.propTypes = {
    children: PropTypes.array,
    className: PropTypes.string,
    has_rounded_button: PropTypes.bool,
    timeout: PropTypes.number,
};

export default HighlightWrapper;
