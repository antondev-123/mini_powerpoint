import React, { useState, useEffect } from "react";
import axios from "axios";
import SlideView from "./components/SlideView/SlideView";
import SlideEditor from "./components/SlideEditor/SlideEditor";
import SlideControls from "./components/SlideControls/SlideControls";
import ProgressBar from "./components/ProgressBar/ProgressBar";
import "./App.css";

const API_URL = "http://localhost:3001";

function App() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [editorContent, setEditorContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editorLayout, setEditorLayout] = useState("default");

  useEffect(() => {
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      setEditorContent(slides[currentSlide].content);
      setEditorLayout(slides[currentSlide].layout || "default");
    }
  }, [currentSlide, slides]);

  const fetchSlides = async () => {
    const response = await axios.get(`${API_URL}/slides`);
    setSlides(response.data);
    return response.data;
  };

  const saveSlide = async () => {
    const slide = slides[currentSlide];
    await axios.put(`${API_URL}/slides/${slide.id}`, {
      content: editorContent,
      layout: editorLayout,
    });
    fetchSlides();
    setIsEditing(false);
  };

  const newSlide = async () => {
    await axios.post(`${API_URL}/slides`, { content: "# New Slide" });
    const newSlides = await fetchSlides();
    setCurrentSlide(newSlides.length > 0 ? newSlides.length - 1 : 0);
  };

  const deleteSlide = async () => {
    const slide = slides[currentSlide];
    await axios.delete(`${API_URL}/slides/${slide.id}`);
    fetchSlides();
    setCurrentSlide(0);
  };

  const handleKeyDown = (e) => {
    if (e.target.tagName.toLowerCase() === "textarea") return;
    if (e.key === "ArrowRight") {
      setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
    } else if (e.key === "ArrowLeft") {
      setCurrentSlide((prev) => Math.max(prev - 1, 0));
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [slides]);

  return (
    <div className="App">
      <div className="presentation-container">
        {slides.length > 0 ? (
          <SlideView
            content={slides[currentSlide].content}
            layout={slides[currentSlide].layout}
          />
        ) : (
          <div className="slide"># Welcome! Create a new slide to begin.</div>
        )}
        <ProgressBar current={currentSlide} total={slides.length} />
      </div>
      <SlideControls
        currentSlide={currentSlide}
        totalSlides={slides.length}
        onPrev={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
        onNext={() =>
          setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))
        }
        onEditToggle={() => setIsEditing(!isEditing)}
        isEditing={isEditing}
        onNewSlide={newSlide}
        onDeleteSlide={deleteSlide}
      />
      {isEditing && (
        <SlideEditor
          content={editorContent}
          layout={editorLayout}
          onChangeContent={setEditorContent}
          onChangeLayout={setEditorLayout}
          onSave={saveSlide}
        />
      )}
    </div>
  );
}

export default App;
