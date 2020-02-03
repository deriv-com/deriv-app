import React from "react";
import { storiesOf } from "@storybook/react";
import Collapsible from "Components/collapsible";
// import 'Components/dropdown/dropdown.scss';
import notes from "./README.md";

const items = [
  {
    text: "Apple",
    value: 1,
    has_tooltip: false,
    tooltip: "",
    disabled: false
  },
  {
    text: "Orange",
    value: 2,
    has_tooltip: false,
    tooltip: "",
    disabled: false
  }
];

storiesOf("Collapsible", module)
  .add(
    "Top",
    () => (
      <Collapsible as="div">
        <div collapsible>Will be collapsed</div>
        <div>Item 2</div>
        <div collapsible>Will be collapsed</div>
        <div>Item 4</div>
        <div>Item 5</div>
        <div>Item 1</div>
      </Collapsible>
    ),
    {
      notes
    }
  )
  .add(
    "Bottom",
    () => (
      <Collapsible position="bottom" is_collapsed>
        <li collapsible>Will be collapsed</li>
        <li>Item 2</li>
        <li collapsible>Will be collapsed</li>
        <li>Item 4</li>
        <li>Item 5</li>
        <li>Item 1</li>
      </Collapsible>
    ),
    {
      notes
    }
  );
