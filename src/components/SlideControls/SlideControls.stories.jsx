import React from "react";
import SlideControls from "./SlideControls";

export default {
  title: "Components/SlideControls",
  component: SlideControls,
};

const Template = (args) => <SlideControls {...args} />;

export const Default = Template.bind({});
Default.args = {
  currentSlide: 1,
  totalSlides: 5,
  onPrev: () => console.log("Previous Slide"),
  onNext: () => console.log("Next Slide"),
  onEditToggle: () => console.log("Edit Toggled"),
  isEditing: false,
  onNewSlide: () => console.log("New Slide Created"),
  onDeleteSlide: () => console.log("Slide Deleted"),
};
