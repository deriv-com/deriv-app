import React                  from 'react';
import { withRouter }         from 'react-router-dom';
import { FormikConsumer }     from 'formik';
import { Button }             from 'deriv-components';
import { localize }           from 'App/i18n';

/**
 * Blocks routing if Formik form is dirty
 * Has to be a child of <Formik> for FormikConsumer to work
 */
class TransitionBlocker extends React.Component {
    state = { show: false }

    componentDidMount() { 
        this.unblock = this.props.history.block(next_location => {
            if (this.props.dirty) {
                this.props.onDirty(false);
                this.setState({
                    show: true,
                    next_location,
                });
            }
            return !this.props.dirty;
        });

    }

    Leave = () => {
        const { pathname } = this.state.next_location;
        this.unblock();
        this.props.history.push(pathname);
    }

    back = () => {
        this.setState({ nextLocation: null, show: false });
        this.props.onDirty(true);
    }

    componentWillUnmount() {
        this.unblock();
    }

    render() {
        const { show } = this.state;

        return (
            <>
                {show &&
                    <>
                        <h2>{localize('Unsaved changes')}</h2>
                        <p>{localize('You have unsaved changes')}</p>
                        <p>{localize('Are you sure you want to discard changes and leave this page?')}</p>
                        <div className='account-management-flex-wrapper'>
                            <Button type='button' onClick={this.back}>{localize('Cancel')}</Button>
                            <Button type='button' onClick={this.leave}>{localize('Leave')}</Button>
                        </div>
                    </>
                }
            </>
        )
    }
}
const TransitionBlockerWithRouter = withRouter(TransitionBlocker);

export const LeaveConfirm = ({ onDirty }) => (
    <FormikConsumer>
        {formik => <TransitionBlockerWithRouter onDirty={onDirty} dirty={formik.dirty && formik.submitCount === 0}/>}
    </FormikConsumer>
);
