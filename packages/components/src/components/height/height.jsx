import PropTypes from 'prop-types';
import React from 'react';

class Height extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            height: props.default_height,
            ref: null,
        };
    }

    setHeight = height => this.setState({ height });
    setRef = ref => this.setState({ ref });
    updateHeight = () => this.setHeight(this.state.ref.clientHeight);

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

Height.propTypes = {
    default_height: PropTypes.any,
    children: PropTypes.any,
};

export default Height;
