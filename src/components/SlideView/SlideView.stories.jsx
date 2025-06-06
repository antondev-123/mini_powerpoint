import React from "react";
import SlideView from "./SlideView";

export default {
  title: "Components/SlideView",
  component: SlideView,
};

const Template = (args) => <SlideView {...args} />;

export const Default = Template.bind({});
Default.args = {
  content: "# Sample Slide\nThis is a Markdown slide.",
  layout: "default",
};
