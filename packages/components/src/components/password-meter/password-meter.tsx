/* eslint @typescript-eslint/triple-slash-reference: "off" */
/// <reference path="../../../@types/@contentpass/zxcvbn/contentpass-zxcvbn-config.d.ts" />
import classNames from 'classnames';
import React from 'react';
import { useIsMounted } from '@deriv/shared';
import Field from '../field';
import Loading from '../loading';

type TPasswordMeter = {
    children?: React.ReactNode | ((prop: { [key: string]: boolean }) => string);
    input: string;
    has_error?: boolean;
    custom_feedback_messages: { [key: string]: string };
};

type TCustomFeedback = { warning: () => string; suggestions: string };

const PasswordMeter = ({ children, has_error, input, custom_feedback_messages }: TPasswordMeter) => {
    const zxcvbn =
        React.useRef<
            (
                propA: string,
                propB: { feedback_messages: { [key: string]: string } }
            ) => { score: number; feedback: TCustomFeedback }
        >();

    const [is_loading, setLoading] = React.useState(true);
    const [score, setScore] = React.useState<number>(0);
    const [feedback, setFeedback] = React.useState<TCustomFeedback>({ warning: () => '', suggestions: '' });

    const isMounted = useIsMounted();

    React.useEffect(() => {
        async function loadLibrary() {
            const lib = await import('@contentpass/zxcvbn');
            zxcvbn.current = lib.default;
            if (isMounted()) setLoading(false);
        }

        loadLibrary();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (typeof zxcvbn.current === 'function') {
            // 0 - 4 Score for password strength
            if (input?.length > 0) {
                const { score: updated_score, feedback: updated_feedback } = zxcvbn.current(input, {
                    feedback_messages: custom_feedback_messages,
                });
                setScore(updated_score);
                setFeedback(updated_feedback);
            } else {
                setScore(0);
                setFeedback({ warning: () => '', suggestions: '' });
            }
        }
    }, [custom_feedback_messages, has_error, input]);

    if (is_loading) return <Loading is_fullscreen={false} />;

    const width_scale = (() => {
        if (has_error && input.length) return 0.25;
        return 0.25 * (input.length && score < 1 ? 1 : score);
    })();
    return (
        <React.Fragment>
            <div className='dc-password-meter__container'>
                {/* if child input field has hint, they should not show the hint while warning is shown */}
                {typeof children === 'function' ? children({ has_warning: !!feedback?.warning }) : children}
                <div className='dc-password-meter__bg' />
                <div
                    className={classNames('dc-password-meter', {
                        'dc-password-meter--weak': has_error || (input.length && score < 3),
                        'dc-password-meter--strong': !has_error && input.length && score >= 3,
                    })}
                    style={{ transform: `scale(${width_scale || 0}, 1)` }}
                />
                {feedback?.warning && !has_error && (
                    <Field
                        className='dc-password-meter__warning'
                        message={`${custom_feedback_messages ? feedback.warning() : feedback.warning}`}
                        type='error'
                    />
                )}
            </div>
        </React.Fragment>
    );
};

export default PasswordMeter;
