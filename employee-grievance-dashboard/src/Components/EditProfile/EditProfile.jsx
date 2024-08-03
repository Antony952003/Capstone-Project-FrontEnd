import React, { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiclient from "../../ApiClient/apiClient"; // Adjust the path as necessary
import styles from "./EditProfile.module.css";
import { AuthContext } from "../../contexts/AuthContext";
import { FaCircleUser } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";

const EditProfile = () => {
  const { auth, setAuth } = useContext(AuthContext);

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    image: "",
  });
  const [isEditable, setIsEditable] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (auth && auth.user) {
      setUser({
        name: auth.user.name,
        email: auth.user.email,
        phone: auth.user.phone,
        image: auth.user.userImage || "",
      });
    }
  }, [auth]);

  const handleEditClick = () => {
    setIsEditable(!isEditable);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setUser((prevUser) => ({
      ...prevUser,
      image: URL.createObjectURL(file),
    }));
  };

  const handleSave = async () => {
    let imageUrl = user.image;
    if (imageFile) {
      imageUrl = await convertToBase64(imageFile);
    }

    const updatedUser = {
      userId: auth.user.userId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      userImage: imageUrl,
    };

    try {
      const response = await apiclient.put(
        "/User/UpdateUserDetails",
        updatedUser
      );

      if (response.status === 200) {
        toast.success("User Details Updated Successfully");
        setIsEditable(false);
        // Optionally, update auth context with the new user data
        setAuth((prevAuth) => ({
          ...prevAuth,
          user: {
            ...prevAuth.user,
            ...updatedUser,
          },
        }));
      } else {
        toast.error("Error saving data");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error saving data");
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  if (!auth || !auth.user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.editcontainer}>
      <div className={styles.editFormContainer}>
        <h2 className={styles.editprofileHead}>Edit User Details</h2>
        <div id="user-image" className={styles.userImage}>
          {auth?.user?.userImage !== "DefaultImage" &&
          auth?.user?.userImage !== "" ? (
            <img src={auth?.user?.userImage} alt="User" />
          ) : (
            <FaCircleUser
              style={{
                width: "120px",
                height: "120px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            />
          )}
        </div>
        <div className={styles.formHeader}>
          <button
            id="edit-btn"
            onClick={handleEditClick}
            className={styles.editBtn}
          >
            <FaRegEdit />
          </button>
        </div>
        <form id="user-form" className={styles.userForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={user.name}
              onChange={handleInputChange}
              readOnly={!isEditable}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              readOnly={!isEditable}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={user.phone}
              onChange={handleInputChange}
              readOnly={!isEditable}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="image">Image:</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              disabled={!isEditable}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="url"
              id="imageurl"
              name="imageurl"
              placeholder="or enter image URL"
              value={user.image}
              onChange={handleInputChange}
              readOnly={!isEditable}
            />
          </div>
          <div className={styles.formActions}>
            <button
              type="button"
              id="save-btn"
              onClick={handleSave}
              className={styles.saveBtn}
              disabled={!isEditable}
            >
              Save
            </button>
            <button
              type="button"
              id="clear-btn"
              onClick={() => setUser({ ...user, image: "", imageurl: "" })}
              className={styles.clearBtn}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditProfile;
