import PropTypes      from 'prop-types';
import React          from 'react';
import { Scrollbars } from 'tt-react-custom-scrollbars';
import Loading        from '../../../../templates/_common/components/loading.jsx';

class CashierContainer extends React.Component {
    render() {
        return (
            <React.Fragment>
                {this.props.is_loading && <Loading />}
                {this.props.iframe_url &&
                <Scrollbars
                    autoHeight
                    autoHide
                    autoHeightMax={550}
                    renderTrackHorizontal={props => <div {...props} className='track-horizontal' style={{ display: 'none' }} />}
                    renderThumbHorizontal={props => <div {...props} className='thumb-horizontal' style={{ display: 'none' }} />}
                >
                    <iframe
                        className='cashier__content'
                        height={this.props.iframe_height}
                        src={this.props.iframe_url}
                        frameBorder='0'
                        scrolling='no'
                    />
                </Scrollbars>
                }
            </React.Fragment>
        );
    }
}

CashierContainer.propTypes = {
    className    : PropTypes.string,
    iframe_height: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    iframe_url: PropTypes.string,
    is_loading: PropTypes.bool,
};

export default CashierContainer;
