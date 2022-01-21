import React from "react";
import { screen, render, fireEvent } from "@testing-library/react";
import Article from "./article";

describe("<Article/>", () => {
    const props = {
        descriptions: [<>description</>],
        title: "title",
        onClickLearnMore: jest.fn(),
    }

    it("should show proper descriptions", () => {
        const { rerender } = render(<Article {...props} />);

        expect(screen.getByText("description")).toBeInTheDocument();
        expect(screen.getByText("title")).toBeInTheDocument();
        expect(screen.getByText("Learn more")).toBeInTheDocument();

        rerender(<Article {...props} descriptions={[<>desc1</>, <>desc2</>]} />);

        expect(screen.getByText("desc1")).toBeInTheDocument();
        expect(screen.getByText("desc2")).toBeInTheDocument();
    })

    it("should trigger onClick callback on learn more", () => {
        const { container } = render(<Article {...props} />);
        const learn_more_div = container.querySelector('.da-article__learn-more');

        fireEvent.click(learn_more_div);

        expect(props.onClickLearnMore).toHaveBeenCalledTimes(1);
    })
})
