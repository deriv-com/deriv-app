import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import BinaryRoutes from 'App/Components/Routes';
import Lazy from 'App/Containers/Lazy';
import { connect } from 'Stores/connect';

class Routes extends React.Component {
    unlisten_to_change = null;
    initial_route = null;

    componentDidMount() {
        if (!this.unlisten_to_change && !this.initial_route) {
            this.initial_route = this.props.location.pathname;
        }

        this.unlisten_to_change = this.props.history.listen(route_to => {
            if (this.initial_route.split('/')[1] !== route_to.pathname.split('/')[1]) {
                this.props.setRoutedInternally(true);

                if (typeof this.unlisten_to_change === 'function') {
                    this.unlisten_to_change();
                    this.unlisten_to_change = null;
                    this.initial_route = null;
                }
            }
        });
    }

    render() {
        const { error, has_error, is_logged_in, passthrough } = this.props;

        if (has_error) {
            return (
                <Lazy
                    ctor={() => import(/* webpackChunkName: "error-component" */ 'App/Components/Elements/Errors')}
                    should_load={has_error}
                    has_progress={true}
                    {...error}
                />
            );
        }

        return <BinaryRoutes is_logged_in={is_logged_in} passthrough={passthrough} />;
    }
}

Routes.propTypes = {
    error: MobxPropTypes.objectOrObservableObject,
    has_error: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_virtual: PropTypes.bool,
};

// need to wrap withRouter around connect
// to prevent updates on <BinaryRoutes /> from being blocked
export default withRouter(
    connect(({ client, common }) => ({
        is_logged_in: client.is_logged_in,
        error: common.error,
        has_error: common.has_error,
        setRoutedInternally: common.setRoutedInternally,
    }))(Routes)
);
