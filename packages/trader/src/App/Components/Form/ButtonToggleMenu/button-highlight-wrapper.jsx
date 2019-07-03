import classnames    from 'classnames';
import PropTypes     from 'prop-types';
import React         from 'react';
import { Highlight } from './button-highlight.jsx';

class HighlightWrapper extends React.PureComponent {
    state = {
        left : 0,
        width: 0,
    }

    componentDidMount() {
        const active_button_el = [...this.node.getElementsByClassName('button-menu__button--active')][0];
        if (!this.node) return;
        this.updateHighlightPosition(active_button_el);
    }

    componentDidUpdate() {
        const active_button_el = [...this.node.getElementsByClassName('button-menu__button--active')][0];
        if (active_button_el) {
            this.updateHighlightPosition(active_button_el);
        } else if (this.state.left !== 0 || this.state.width !== 0) {
            this.resetHighlight(); // clear highlight when active element doesn't exist
        }
    }

    componentWillUnMount() {
        this.resetHighlight();
    }

    onClick = (e, buttonClick) => {
        if (!e.target) return;
        this.updateHighlightPosition(e.target.closest('button'));
        if (typeof buttonClick  === 'function') {
            buttonClick();
        }
    };

    resetHighlight = () => {
        this.setState({
            left : 0,
            width: 0,
        });
    };

    updateHighlightPosition = (el) => {
        if (!el) return;
        const { offsetLeft: left, offsetWidth: width } = el;
        if (this.state.width !== width) {
            this.setState({ width });
        }
        if (this.state.left !== left) {
            this.setState({ left });
        }
    };

    render() {
        const { className, ...other_props } = this.props;
        const props = {
            className: classnames('button-menu__wrapper', className),
            ...other_props,
        };

        return (
            <div ref={(node) => this.node = node} {...props}>
                {
                    React.Children.map(this.props.children, child => (
                        React.cloneElement(child, {
                            onClick: (e) => this.onClick(e, child.props.onClick),
                        })
                    ))
                }
                <Highlight left={this.state.left} width={this.state.width} />
            </div>
        );
    }
}

HighlightWrapper.propTypes = {
    children : PropTypes.array,
    className: PropTypes.string,
    timeout  : PropTypes.number,
};

export default HighlightWrapper;
