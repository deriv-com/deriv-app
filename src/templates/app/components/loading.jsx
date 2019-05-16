import React               from 'react';
import PropTypes           from 'prop-types';
import {
    Icon,
    IconInitialLogoDark,
    IconInitialLogoLight } from '../../../javascript/app/Assets/Common';

class Loading extends React.Component {

    state = {
        is_mounted: false,
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.status !== this.props.status || nextProps.theme !== this.props.theme;
    }

    componentDidMount() {
        this.setState({
            is_mounted: true,
        });
    }

    render() {
        return (
            <div id={this.props.id} className={`initial-loader initial-loader--${this.props.theme}`}>
                { this.state.is_mounted &&
                    <React.Fragment>
                        { this.props.theme === 'dark' &&
                            <Icon
                                icon={IconInitialLogoDark}
                                className='initial-loader__image'
                                classNamePath='initial-loader__mask'
                                classNameRect='initial-loader__fill'
                            />
                        }
                        { this.props.theme === 'light' &&
                            <Icon
                                icon={IconInitialLogoLight}
                                className='initial-loader__image'
                                classNamePath='initial-loader__mask'
                                classNameRect='initial-loader__fill'
                            />
                        }
                        { this.props.status && <h1 className='initial-loader__status'>{this.props.status}</h1>}
                    </React.Fragment>
                }
            </div>
        );
    }
}

Loading.propTypes = {
    id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    status: PropTypes.string,
    theme : PropTypes.string,
};
export default Loading;
