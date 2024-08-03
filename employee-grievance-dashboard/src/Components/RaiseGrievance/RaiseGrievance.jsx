import React, { useState, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import apiClient from "../../ApiClient/apiClient";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "./RaiseGrievance.module.css";
import { PacmanLoader } from "react-spinners";

const RaiseGrievance = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [type, setType] = useState("");
  const [documentFiles, setDocumentFiles] = useState([]);
  const { auth } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setDocumentFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("priority", priority);
    formData.append("type", type);
    for (let i = 0; i < documentFiles.length; i++) {
      formData.append("documents", documentFiles[i]);
    }

    try {
      const response = await apiClient.post(
        `/Employee/raise-grievance`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      toast.success("Grievance raised successfully!");
      setTitle("");
      setDescription("");
      setPriority("");
      setType("");
      setDocumentFiles([]);
    } catch (error) {
      console.error(
        "Failed to raise grievance:",
        error.response?.data?.message || error.message
      );
      toast.error(
        <>
          <span
            style={{
              fontWeight: 400,
              fontSize: "16px",
              color: "red",
              textAlign: "center",
            }}
          >
            Error in raising grivance
          </span>
          <br />
          <span
            style={{
              fontWeight: 400,
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {error.response?.data?.details || error.message}
          </span>
        </>
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.raiseGrievanceContainer}>
      {loading && (
        <div className={styles.loaderOverlay}>
          <PacmanLoader
            color="#007bff"
            cssOverride={{}}
            loading
            margin={0}
            speedMultiplier={1}
          />
        </div>
      )}
      <h2 className={styles.heading}>Raise Grievance</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Moderate">Moderate</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="type">Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">Select Type</option>
            <option value="HR">HR</option>
            <option value="IT">IT</option>
            <option value="Facilities">Facilities</option>
            <option value="ProjectManagement">ProjectManagement</option>
            <option value="Administration">Administration</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="documents">Upload Documents</label>
          <input
            type="file"
            id="documents"
            multiple
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default RaiseGrievance;
