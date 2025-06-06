import React from "react";

const SlideControls = ({
  currentSlide,
  totalSlides,
  onPrev,
  onNext,
  onEditToggle,
  isEditing,
  onNewSlide,
  onDeleteSlide,
}) => (
  <div className="controls">
    <button onClick={onPrev} disabled={currentSlide === 0}>
      Prev
    </button>
    <span>{`${currentSlide + 1} / ${totalSlides}`}</span>
    <button onClick={onNext} disabled={currentSlide >= totalSlides - 1}>
      Next
    </button>
    <button onClick={onEditToggle}>{isEditing ? "Cancel" : "Edit"}</button>
    <button onClick={onNewSlide}>New Slide</button>
    <button onClick={onDeleteSlide} disabled={totalSlides === 0}>
      Delete Slide
    </button>
  </div>
);

export default SlideControls;
