import PropTypes      from 'prop-types';
import React          from 'react';
import { Scrollbars } from 'tt-react-custom-scrollbars';
import Loading        from '../../../../templates/app/components/loading.jsx';

class CashierContainer extends React.Component {
    render() {
        return (
            <React.Fragment>
                {this.props.is_loading && <Loading />}
                {this.props.container_url &&
                <Scrollbars
                    autoHeight
                    autoHide
                    autoHeightMax={550}
                    renderTrackHorizontal={props => <div {...props} className='track-horizontal' style={{ display: 'none' }} />}
                    renderThumbHorizontal={props => <div {...props} className='thumb-horizontal' style={{ display: 'none' }} />}
                >
                    <iframe
                        className='cashier__content'
                        height={this.props.container_height}
                        src={this.props.container_url}
                        frameBorder='0'
                        scrolling='no'
                    />
                </Scrollbars>
                }
                {/* TODO: uncomment this if cross origin issue is fixed */}
                {/* <div */}
                {/*     className={`${this.props.className}__content`} */}
                {/*     dangerouslySetInnerHTML={{ __html: this.props.container_url }} */}
                {/* /> */}
            </React.Fragment>
        );
    }
}

CashierContainer.propTypes = {
    className       : PropTypes.string,
    container_height: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    container_url: PropTypes.string,
    is_loading   : PropTypes.bool,
    onMount      : PropTypes.func,
};

export default CashierContainer;
