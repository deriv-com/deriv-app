import React from 'react';
import { withRouter } from 'react-router-dom';
import { FadeWrapper, PageOverlay, Div100vhContainer } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import ComplaintsPolicyContent from './complaints-policy-content.jsx';
import 'Sass/app/modules/complaints-policy.scss';

class ComplaintsPolicy extends React.Component {
    state = {
        is_visible: false,
    };

    componentDidMount() {
        this.setState({ is_visible: true });
    }

    componentWillUnmount() {
        this.setState({ is_visible: false });
    }

    onClickClose = () => this.props.routeBackInApp(this.props.history);

    render() {
        return (
            <FadeWrapper is_visible={this.state.is_visible} keyname='complaints-policy-page-wrapper'>
                <PageOverlay header={localize('Complaints policy')} onClickClose={this.onClickClose}>
                    <Div100vhContainer className='cashier__wrapper--is-mobile' height_offset='80px'>
                        <ComplaintsPolicyContent />
                    </Div100vhContainer>
                </PageOverlay>
            </FadeWrapper>
        );
    }
}

export default connect(({ common }) => ({ routeBackInApp: common.routeBackInApp }))(withRouter(ComplaintsPolicy));
