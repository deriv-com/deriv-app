import React                  from 'react';
import { withRouter }         from 'react-router-dom';
import { FormikConsumer }     from 'formik';
import { Button }             from 'deriv-components';
import { localize }           from 'deriv-translations';
import IconUnsavedChanges     from 'Assets/AccountManagement/icon-unsaved-changes.svg';
import IconMessageContent     from './icon-message-content.jsx';

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

    leave = () => {
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
                        <IconMessageContent
                            message={localize('You have unsaved changes')}
                            text={localize('Are you sure you want to discard changes and leave this page?')}
                            icon={<IconUnsavedChanges />}
                        >
                            <div className='account-management-flex-wrapper'>
                                <Button
                                    type='button'
                                    has_effect
                                    onClick={this.back}
                                    text={localize('Cancel')}
                                    tertiary
                                />
                                <Button
                                    type='button'
                                    has_effect
                                    onClick={this.leave}
                                    text={localize('Leave')}
                                    primary
                                />
                            </div>
                        </IconMessageContent>
                    </>
                }
            </>
        );
    }
}
const TransitionBlockerWithRouter = withRouter(TransitionBlocker);

export const LeaveConfirm = ({ onDirty }) => (
    <FormikConsumer>
        {formik => <TransitionBlockerWithRouter onDirty={onDirty} dirty={formik.dirty && formik.submitCount === 0} />}
    </FormikConsumer>
);
