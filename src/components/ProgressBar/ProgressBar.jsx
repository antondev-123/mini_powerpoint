import React from "react";

const ProgressBar = ({ current, total }) => (
  <div className="progress-bar">
    <div
      className="progress"
      style={{ width: `${((current + 1) / total) * 100}%` }}
    ></div>
  </div>
);

export default ProgressBar;
