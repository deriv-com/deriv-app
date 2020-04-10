import PropTypes from 'prop-types';
import React from 'react';
import Loading from '../../../templates/_common/components/loading.jsx';

class CashierContainer extends React.Component {
    render() {
        return (
            <div className='cashier__wrapper'>
                {this.props.is_loading && <Loading />}
                {this.props.iframe_url && (
                    <iframe
                        className='cashier__content'
                        height={this.props.iframe_height}
                        src={this.props.iframe_url}
                        frameBorder='0'
                        scrolling='auto'
                    />
                )}
            </div>
        );
    }
}

CashierContainer.propTypes = {
    className: PropTypes.string,
    iframe_height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    iframe_url: PropTypes.string,
    is_loading: PropTypes.bool,
};

export default CashierContainer;
