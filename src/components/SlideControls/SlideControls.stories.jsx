import React from "react";
import SlideControls from "./SlideControls";
import { action } from "@storybook/addon-actions";

export default {
  title: "Components/SlideControls",
  component: SlideControls,
};

const Template = (args) => <SlideControls {...args} />;

export const Default = Template.bind({});
Default.args = {
  currentSlide: 1,
  totalSlides: 5,
  onPrev: action("Clicked Prev"),
  onNext: action("Clicked Next"),
  onEditToggle: action("Toggled Edit"),
  onNewSlide: action("New Slide"),
  onDeleteSlide: action("Deleted Slide"),
  isEditing: false,
  deleting: false,
};

export const Deleting = Template.bind({});
Deleting.args = {
  ...Default.args,
  deleting: true,
};
