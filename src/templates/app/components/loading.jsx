<<<<<<< HEAD
import React     from 'react';
import PropTypes from 'prop-types';
import Icon      from '../../../javascript/app/Assets/Common';

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
                                icon='IconInitialLogoDark'
                                className='initial-loader__image'
                                classNamePath='initial-loader__mask'
                                classNameRect='initial-loader__fill'
                            />
                        }
                        { this.props.theme === 'light' &&
                            <Icon
                                icon='IconInitialLogoLight'
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
=======
import React               from 'react';
import PropTypes           from 'prop-types';

const Loading = ({ theme, id }) => (
    <div className='initial-loader'>
        <div id={id} className={`initial-loader__barspinner barspinner barspinner-${ theme || 'light'}`}>
            { Array.from(new Array(5)).map((x, inx) => (
                <div key={inx} className={`initial-loader__barspinner--rect barspinner__rect barspinner__rect--${inx + 1} rect${inx + 1}`} />
            ))}
        </div>
    </div>
);
>>>>>>> e79bd60f02f95b61175386c2f75292b1bb035f9e

Loading.propTypes = {
    id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    theme: PropTypes.string,
};
export default Loading;
