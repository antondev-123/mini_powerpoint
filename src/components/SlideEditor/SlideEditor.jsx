import React from "react";

const SlideEditor = ({
  content,
  layout,
  onChangeContent,
  onChangeLayout,
  onSave,
}) => (
  <div className="editor-container">
    <textarea
      value={content}
      onChange={(e) => onChangeContent(e.target.value)}
    />
    <select value={layout} onChange={(e) => onChangeLayout(e.target.value)}>
      <option value="default">Default</option>
      <option value="title-slide">Title Slide</option>
      <option value="two-columns">Two Columns</option>
    </select>
    <button onClick={onSave}>Save</button>
  </div>
);

export default SlideEditor;
