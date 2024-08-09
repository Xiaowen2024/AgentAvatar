import React, { useState, useRef, CSSProperties } from "react";
import styled from "styled-components";

// Container styled-component with flexbox layout
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 60px;
  width: 60%;
  height: 80vh;
  max-width: 1000px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

// Styled-components definition for UploadBoxContainer
const UploadBoxContainer = styled.div`
  text-align: center;
  border: 2px dashed #6699cc;
  border-radius: 8px;
  padding: 40px;
  width: 90%;
  background-color: #f2f5ff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  &:hover {
    background-color: #e0eaff;
  }
  img {
    width: 30%; /* Make the image width smaller */
    margin-bottom: 10px;
  }
  p {
    color: #425c77;
    font-size: 18px;
    margin: 0;
  }
  span {
    color: #6699cc;
    text-decoration: underline;
    cursor: pointer;
  }
`;

// TextArea styled-component with increased height
const TextArea = styled.textarea`
  height: 200px; /* Increase the height */
  width: 95%;
  background-color: #F1F4F9;
  border: none;
  border-radius: 8px;
  margin-top: 10px;
  margin-bottom: 20px;
  padding: 10px;
  font-size: 16px;
`;

// Inline styles for button
const styles: { [key: string]: CSSProperties } = {
  button: {
    padding: "12px 24px",
    fontSize: "18px",
    cursor: "pointer",
    backgroundColor: "#AABCDE",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#6B98EE",
  },
};

// TypeScript interface for props
interface UploadBoxProps {
  onFilesAdded: (files: FileList) => void;
}

// UploadBox component
const UploadBox: React.FC<UploadBoxProps> = ({ onFilesAdded }) => {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const files = event.dataTransfer.files;
    onFilesAdded(files);
  };

  const [description, setDescription] = useState("");

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      onFilesAdded(files);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = () => {
    // Handle submit action
  };

  return (
    <Container>
      <UploadBoxContainer
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <img src={require("./img/ph.svg").default} alt="Upload" />
        <p>
          Drop your image here, or{" "}
          <span onClick={handleBrowseClick}>browse</span>
        </p>
        <p>Supports: PNG, JPG, JPEG, WEBP</p>
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileInput}
        />
      </UploadBoxContainer>
      <TextArea
        placeholder="Please describe why this image is important to you. Try best to describe more emotions and memories. "
        value={description}
        onChange={handleDescriptionChange}
      />
      <button
        style={styles.button}
        onClick={handleSubmit}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)}
      >
        Submit Picture
      </button>
    </Container>
  );
};

export default UploadBox;
