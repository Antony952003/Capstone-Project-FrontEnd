import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import apiClient from "../../ApiClient/apiClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProvideSolutionPopup.css";
import { PacmanLoader } from "react-spinners";

const ProvideSolutionPopup = ({ grievanceId, onClose, onSolutionProvided }) => {
  const [solutionTitle, setSolutionTitle] = useState("");
  const [description, setDescription] = useState("");
  const [documentFiles, setDocumentFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { auth } = useContext(AuthContext);

  const handleFileChange = (e) => {
    setDocumentFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader

    const formData = new FormData();
    formData.append("GrievanceId", grievanceId);
    formData.append("SolverId", auth.user.userId); // Assuming solver ID is the logged-in user ID
    formData.append("SolutionTitle", solutionTitle);
    formData.append("Description", description);
    for (let i = 0; i < documentFiles.length; i++) {
      formData.append("documents", documentFiles[i]);
    }

    try {
      await apiClient.post("/Solution/provide-solution", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Solution provided successfully!");
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <div className="provide-solution-popup-overlay">
      <div className="provide-solution-popup">
        {loading && (
          <div className="loader-overlay">
            <PacmanLoader
              color="#007bff"
              cssOverride={{}}
              loading
              margin={0}
              speedMultiplier={1}
            />
          </div>
        )}
        <h2>Provide Solution</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="solutionTitle">Solution Title</label>
            <input
              type="text"
              id="solutionTitle"
              value={solutionTitle}
              onChange={(e) => setSolutionTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="documents">Upload Documents</label>
            <input
              type="file"
              id="documents"
              multiple
              onChange={handleFileChange}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button">
              Submit
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProvideSolutionPopup;
