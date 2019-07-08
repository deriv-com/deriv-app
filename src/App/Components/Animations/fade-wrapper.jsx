import PropTypes      from 'prop-types';
import React          from 'react';
import posed,
{ PoseGroup }         from 'react-pose';

const FadeInFromTopDiv = posed.div({
    enter: {
        y         : 0,
        opacity   : 1,
        delay     : 300,
        transition: {
            default: { duration: 250 },
        },
    },
    exit: {
        y         : -50,
        opacity   : 0,
        transition: { duration: 250 },
    },
});

const FadeInFromBottomDiv = posed.div({
    enter: {
        y         : 0,
        opacity   : 1,
        delay     : 300,
        transition: {
            default: { duration: 250 },
        },
    },
    exit: {
        y         : 50,
        opacity   : 0,
        transition: { duration: 250 },
    },
});

const FadeInOnlyDiv = posed.div({
    enter: {

        opacity   : 1,
        transition: { duration: 300 },
    },
    exit: {
        opacity   : 0,
        transition: { duration: 300 },
    },
});

const FadeWrapper = ({
    children,
    className,
    is_visible,
    keyname,
    type,
}) => {
    if (type === 'top') {
        return (
            <PoseGroup>
                {is_visible &&
                    <FadeInFromTopDiv className={className} key={keyname}>
                        {children}
                    </FadeInFromTopDiv>
                }
            </PoseGroup>
        );
    }
    if (type === 'bottom') {
        return (
            <PoseGroup>
                {is_visible &&
                    <FadeInFromBottomDiv className={className} key={keyname}>
                        {children}
                    </FadeInFromBottomDiv>
                }
            </PoseGroup>
        );
    }
    return (
        <PoseGroup>
            {is_visible &&
                <FadeInOnlyDiv className={className} key={keyname}>
                    {children}
                </FadeInOnlyDiv>
            }
        </PoseGroup>
    );
};

FadeWrapper.propTypes = {
    children  : PropTypes.node,
    is_visible: PropTypes.bool,
    keyname   : PropTypes.string,
    type      : PropTypes.string,
};

export { FadeWrapper };
