import PropTypes from 'prop-types';
import React     from 'react';
import Loading   from '../../../templates/_common/components/loading.jsx';

class CashierContainer extends React.Component {
    componentDidMount() {
        this.props.onMount();
    }

    render() {
        return (
            <React.Fragment>
                {this.props.is_loading && <Loading />}
                {this.props.container_url &&
                <iframe
                    className={`${this.props.className}__content`}
                    height={this.props.container_height}
                    src={this.props.container_url}
                    frameBorder='0'
                    scrolling='auto'
                />
                }
                {this.props.error_message && <p>{this.props.error_message}</p>}
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
    error_message: PropTypes.string,
    is_loading   : PropTypes.bool,
    onMount      : PropTypes.func,
};

export default CashierContainer;
