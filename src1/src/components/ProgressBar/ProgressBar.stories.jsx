import React from "react";
import ProgressBar from "./ProgressBar";

export default {
  title: "Components/ProgressBar",
  component: ProgressBar,
};

const Template = (args) => <ProgressBar {...args} />;

export const Default = Template.bind({});
Default.args = {
  current: 2,
  total: 5,
};
