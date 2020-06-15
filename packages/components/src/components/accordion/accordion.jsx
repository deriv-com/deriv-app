import PropTypes from 'prop-types';
import React from 'react';
import styled, { css } from 'styled-components';
import Icon from '../icon';

const AccordionWrapper = styled.div`
    > div:first-child {
        border-top-right-radius: 4px;
        border-top-left-radius: 4px;
    }
    > div:last-child {
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px;
        border-bottom-width: 1px;
    }
`;

const AccordionItem = styled.div`
    border: 1px solid var(--general-section-1);
    border-bottom-width: 0;
    color: var(--text-general);
    font-size: 1.4rem;
    ${props =>
        props.is_open
            ? css`
                  ${AccordionItemHeader} {
                      border-bottom: 1px solid var(--general-section-1);
                  }
                  ${AccordionItemContent} {
                      display: block;
                  }
              `
            : css`
                  ${AccordionItemContent} {
                      display: none;
                  }
              `}
`;

const AccordionItemHeader = styled.div`
    cursor: pointer;
    line-height: 1.43;
    padding: 8px 16px;
`;

const AccordionItemContent = styled.div`
    padding: 16px;
`;

const AccordionIconWrapper = styled.div`
    float: right;
    padding-left: 16px;
    ${Icon} {
        vertical-align: middle;

        path,
        rect {
            fill: var(--text-general);
        }
    }
`;

class Accordion extends React.Component {
    state = {
        open_idx: null,
    };

    componentDidUpdate(prevProps) {
        if (this.props.list !== prevProps.list) {
            this.setState({ open_idx: null });
        }
    }

    onClick(index) {
        // close if clicking the accordion that's open, otherwise open the new one
        this.setState({ open_idx: index === this.state.open_idx ? null : index });
    }

    render() {
        const { list, className } = this.props;
        const { open_idx } = this.state;

        return (
            <AccordionWrapper className={className}>
                {list.map((item, idx) => (
                    <AccordionItem is_open={open_idx === idx} key={idx}>
                        <AccordionItemHeader onClick={() => this.onClick(idx)}>
                            {item.header}
                            <AccordionIconWrapper>
                                {open_idx === idx ? <Icon icon='IcMinus' /> : <Icon icon='IcAdd' />}
                            </AccordionIconWrapper>
                        </AccordionItemHeader>
                        <AccordionItemContent>{item.content}</AccordionItemContent>
                    </AccordionItem>
                ))}
            </AccordionWrapper>
        );
    }
}

Accordion.propTypes = {
    className: PropTypes.string,
    list: PropTypes.arrayOf(PropTypes.object),
};

export default Accordion;
