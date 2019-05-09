import classNames          from 'classnames';
import React               from 'react';
import PropTypes           from 'prop-types';
import {
    Icon,
    IconInitialLogoDark,
    IconInitialLogoLight } from '../../../javascript/app_2/Assets/Common';

class Loading extends React.Component {

    state = {
        is_mounted: false,
    }

    shouldComponentUpdate(nextProps) {
        return (nextProps.status !== this.props.status) || (nextProps.theme !== this.props.theme);
    }

    componentDidMount() {
        this.setState({
            is_mounted: true,
        });
    }

    render() {
        const { id, status, theme } = this.props;
        const { is_mounted }        = this.state;
        return (
            <div
                className={classNames('initial-loader', {
                    [`initial-loader--${theme}`]: theme,
                })}
                id={id}
            >
                {is_mounted &&
                    <React.Fragment>
                        { theme === 'dark' &&
                            <Icon
                                icon={IconInitialLogoDark}
                                className='initial-loader__image'
                                classNamePath='initial-loader__mask'
                                classNameRect='initial-loader__fill'
                            />
                        }
                        { theme === 'light' &&
                            <Icon
                                icon={IconInitialLogoLight}
                                className='initial-loader__image'
                                classNamePath='initial-loader__mask'
                                classNameRect='initial-loader__fill'
                            />
                        }
                        { status && <h1 className='initial-loader__status'>{status}</h1> }
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
