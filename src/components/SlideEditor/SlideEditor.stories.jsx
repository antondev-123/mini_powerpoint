import React from "react";
import SlideEditor from "./SlideEditor";
import { action } from "@storybook/addon-actions";

export default {
  title: "Components/SlideEditor",
  component: SlideEditor,
};

const Template = (args) => <SlideEditor {...args} />;

export const Default = Template.bind({});
Default.args = {
  content: "# Editable Slide",
  layout: "default",
  onChangeContent: action("Changed Content"),
  onChangeLayout: action("Changed Layout"),
  onSave: action("Saved Slide"),
};
