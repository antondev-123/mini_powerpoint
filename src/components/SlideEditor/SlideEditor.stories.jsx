import React from "react";
import SlideEditor from "./SlideEditor";

export default {
  title: "Components/SlideEditor",
  component: SlideEditor,
};

const Template = (args) => <SlideEditor {...args} />;

export const Default = Template.bind({});
Default.args = {
  content: "# Editable Slide",
  layout: "default",
  onChangeContent: (val) => console.log("Content Changed:", val),
  onChangeLayout: (val) => console.log("Layout Changed:", val),
  onSave: () => console.log("Saved"),
};
