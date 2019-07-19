import PropTypes from 'prop-types';
import React     from 'react';
import Loading   from '../../../../templates/_common/components/loading.jsx';

class CashierContainer extends React.Component {
    componentDidMount() {
        this.props.onMount(this.props.verification_code);
    }

    render() {
        return (
            <React.Fragment>
                {this.props.is_loading && <Loading />}
                {this.props.container_url &&
                <div className='cashier__content-wrapper' height={this.props.container_height}>
                    <iframe
                        className='cashier__content'
                        height={this.props.container_height}
                        src={this.props.container_url}
                        frameBorder='0'
                        scrolling='auto'
                    />
                </div>
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
    container_url    : PropTypes.string,
    is_loading       : PropTypes.bool,
    onMount          : PropTypes.func,
    verification_code: PropTypes.string,
};

export default CashierContainer;
