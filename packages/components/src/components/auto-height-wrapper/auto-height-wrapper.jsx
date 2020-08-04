import PropTypes from 'prop-types';
import React from 'react';

class AutoHeightWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            height: props.default_height,
            ref: null,
        };
    }

    setHeight = height => this.setState({ height });
    setRef = ref =>
        this.setState({ ref }, () => {
            this.updateHeight();
        });
    updateHeight = () =>
        this.setHeight(
            this.state.ref.clientHeight > this.props.default_height
                ? this.state.ref.clientHeight - (this.props.height_offset || 0)
                : this.props.default_height
        );
    componentDidMount() {
        window.addEventListener('resize', this.updateHeight);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateHeight);
    }

    render() {
        return this.props.children({
            ...this.props,
            height: this.state.height,
            setRef: this.setRef,
        });
    }
}

AutoHeightWrapper.propTypes = {
    default_height: PropTypes.any,
    children: PropTypes.any,
    height_offset: PropTypes.number,
};

export default AutoHeightWrapper;
