import React, { useState, useEffect } from "react";
import axios from "axios";
import SlideView from "./components/SlideView/SlideView";
import SlideEditor from "./components/SlideEditor/SlideEditor";
import SlideControls from "./components/SlideControls/SlideControls";
import ProgressBar from "./components/ProgressBar/ProgressBar";
import "./App.css";

const API_URL = "https://mini-powerpoint-backend.onrender.com";

function App() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [editorContent, setEditorContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
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
    try {
      const response = await axios.get(`${API_URL}/slides`);
      setSlides(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching slides:", error);
      return [];
    }
  };

  const saveSlide = async () => {
    const slide = slides[currentSlide];
    try {
      await axios.put(`${API_URL}/slides/${slide.id}`, {
        content: editorContent,
        layout: editorLayout,
      });
      await fetchSlides(); // ✅ wait for it to finish before UI continues
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving slide:", error);
      alert("Failed to save slide.");
    }
  };

  const newSlide = async () => {
    try {
      await axios.post(`${API_URL}/slides`, { content: "# New Slide" });
      const newSlides = await fetchSlides(); // ✅ ensure currentSlide is set after data update
      setCurrentSlide(newSlides.length > 0 ? newSlides.length - 1 : 0);
    } catch (error) {
      console.error("Error creating slide:", error);
      alert("Failed to create a new slide.");
    }
  };

  const deleteSlide = async () => {
    if (deleting) return;
    const slide = slides[currentSlide];
    if (!slide) {
      alert("No slide to delete.");
      return;
    }
    setDeleting(true);
    try {
      await axios.delete(`${API_URL}/slides/${slide.id}`);
      const updatedSlides = await fetchSlides(); // ✅ update UI after deletion

      // Set currentSlide to a safe index
      if (updatedSlides.length === 0) {
        setCurrentSlide(0);
      } else {
        setCurrentSlide(Math.max(0, currentSlide - 1));
      }
    } catch (error) {
      console.error("Error deleting slide:", error);
      alert("Failed to delete the slide. It may not exist on the server.");
    } finally {
      setDeleting(false);
    }
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
        deleting={deleting} // ✅ pass down here
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
