import React, { useState, useEffect } from "react";
import axios from "axios";
import SlideView from "./components/SlideView/SlideView";
import SlideEditor from "./components/SlideEditor/SlideEditor";
import SlideControls from "./components/SlideControls/SlideControls";
import ProgressBar from "./components/ProgressBar/ProgressBar";
import "./App.css";

const API_URL = "https://mini-powerpoint-backend.onrender.com";

function App() {
  const [markdown, setMarkdown] = useState("");
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [presentationMode, setPresentationMode] = useState(false);
  const [layout, setLayout] = useState("default");

  useEffect(() => {
    fetchDocument();
  }, []);

  useEffect(() => {
    const parsedSlides = splitSlides(markdown);
    setSlides(parsedSlides);
  }, [markdown]);

  useEffect(() => {
    setEditorContent(markdown);
  }, [markdown]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName.toLowerCase() === "textarea") return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [slides]);

  const fetchDocument = async () => {
    try {
      const response = await axios.get(`${API_URL}/document`);
      setMarkdown(response.data.content || "");
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  const saveDocument = async () => {
    try {
      await axios.put(`${API_URL}/document`, { content: editorContent });
      setMarkdown(editorContent);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving document:", error);
      alert("Failed to save document.");
    }
  };

  const newSlide = () => {
    const newContent = markdown.trim() + `\n\n# New Slide`;
    setMarkdown(newContent);
    setEditorContent(newContent);
    const split = splitSlides(newContent);
    setSlides(split);
    setCurrentSlide(split.length - 1);
  };

  const deleteSlide = () => {
    if (deleting || slides.length === 0) return;
    setDeleting(true);

    const split = splitSlides(markdown);
    split.splice(currentSlide, 1);
    const newMarkdown = split.join("\n\n");

    setMarkdown(newMarkdown);
    setEditorContent(newMarkdown);
    setCurrentSlide(Math.max(0, currentSlide - 1));
    setDeleting(false);
  };

  const splitSlides = (markdown) => {
    const lines = markdown.split("\n");
    const slides = [];
    let current = [];

    for (const line of lines) {
      if (/^#{1,2} /.test(line) && current.length) {
        slides.push(current.join("\n"));
        current = [];
      }
      current.push(line);
    }

    if (current.length) slides.push(current.join("\n"));
    return slides;
  };

  // const toggleFullscreen = () => {
  //   const elem = document.documentElement;
  //   if (!document.fullscreenElement) {
  //     elem.requestFullscreen().catch((err) => {
  //       alert(`Error attempting fullscreen: ${err.message}`);
  //     });
  //   } else {
  //     document.exitFullscreen();
  //   }
  // };

  const togglePresentationMode = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem
        .requestFullscreen()
        .catch((err) => alert(`Error entering fullscreen: ${err.message}`));
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = !!document.fullscreenElement;
      setPresentationMode(isFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div className={`App ${presentationMode ? "presentation-mode" : ""}`}>
      <div className="presentation-container">
        {slides.length > 0 ? (
          <SlideView content={slides[currentSlide]} />
        ) : (
          <div className="slide"># Welcome! Create a new slide to begin.</div>
        )}
        <ProgressBar current={currentSlide} total={slides.length || 1} />
      </div>
      {!presentationMode && (
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
          deleting={deleting}
          presentationMode={presentationMode}
          onTogglePresentation={togglePresentationMode}
        />
      )}

      {isEditing && !presentationMode && (
        <SlideEditor
          content={editorContent}
          onChangeContent={setEditorContent}
          onSave={saveDocument}
          layout={layout}
          onChangeLayout={setLayout}
        />
      )}
    </div>
  );
}

export default App;
