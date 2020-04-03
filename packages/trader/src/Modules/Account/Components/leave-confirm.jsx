import React from 'react';
import { withRouter } from 'react-router-dom';
import { FormikConsumer } from 'formik';
import { Button, Icon } from '@deriv/components';
import { isMobile } from '@deriv/shared/utils/screen';
import { localize } from '@deriv/translations';
import IconMessageContent from './icon-message-content.jsx';

/**
 * Blocks routing if Formik form is dirty
 * Has to be a child of <Formik> for FormikConsumer to work
 */
class TransitionBlocker extends React.Component {
    state = { show: false };

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
    };

    back = () => {
        this.setState({ nextLocation: null, show: false });
        this.props.onDirty(true);
    };

    componentWillUnmount() {
        this.unblock();
    }

    render() {
        const { show } = this.state;

        return (
            <>
                {show && (
                    <>
                        <IconMessageContent
                            className='leave-confirm'
                            message={localize('Unsaved changes')}
                            text={localize(
                                'You have unsaved changes. Are you sure you want to discard changes and leave this page?'
                            )}
                            icon={<Icon icon='IcUnsavedChanges' size={isMobile() ? 93 : 128} />}
                        >
                            <div className='account-management-flex-wrapper account-management-leave-confirm'>
                                <Button
                                    type='button'
                                    has_effect
                                    onClick={this.back}
                                    text={localize('Cancel')}
                                    secondary
                                    {...(isMobile() ? { large: true } : {})}
                                />
                                <Button
                                    type='button'
                                    has_effect
                                    onClick={this.leave}
                                    text={localize('Leave')}
                                    primary
                                    {...(isMobile() ? { large: true } : {})}
                                />
                            </div>
                        </IconMessageContent>
                    </>
                )}
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
