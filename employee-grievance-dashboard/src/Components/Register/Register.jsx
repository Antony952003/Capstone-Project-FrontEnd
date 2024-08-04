// src/components/RegisterForm.js
import { React, useContext, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../FormStyles/formStyles.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { PacmanLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

const Register = () => {
  const {
    register,
    checkUsernameAvailability,
    checkUsermailAvailability,
    loading,
  } = useContext(AuthContext);
  const [usernameError, setUsernameError] = useState("");
  const [usermailError, setUsermailError] = useState("");
  const validateUsername = async (value) => {
    if (value) {
      const isAvailable = await checkUsernameAvailability(value);
      setUsernameError(
        isAvailable == "Available" ? "" : "Username is already taken"
      );
    }
  };
  const validateUsermail = async (value) => {
    if (value) {
      const isAvailable = await checkUsermailAvailability(value);
      setUsermailError(
        isAvailable == "Available" ? "" : "Usermail is already taken"
      );
    }
  };
  const navigate = useNavigate();
  return (
    <div className="form-body-register">
      <h2>
        <span className="colored">S</span>olution{" "}
        <span className="colored">S</span>
        pheres
      </h2>
      {loading ? (
        <div className="loader-container">
          <PacmanLoader
            color="#007bff"
            cssOverride={{}}
            loading
            margin={0}
            speedMultiplier={1}
          />
        </div>
      ) : (
        <>
          <div className="form-container">
            <h2 className="head-1">Register</h2>
            <Formik
              initialValues={{
                name: "",
                email: "",
                phone: "",
                dob: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                await register(
                  values.name,
                  values.email,
                  values.phone,
                  values.dob,
                  values.password,
                  "DefaultImage"
                );
              }}
            >
              <Form>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    validate={validateUsername}
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="error-message"
                  />
                  {usernameError && (
                    <div className="error-message">{usernameError}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    validate={validateUsermail}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error-message"
                  />
                  {usermailError && (
                    <div className="error-message">{usermailError}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <Field type="text" id="phone" name="phone" />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dob">Date of Birth</label>
                  <Field type="date" id="dob" name="dob" />
                  <ErrorMessage
                    name="dob"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Field type="password" id="password" name="password" />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <Field
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="error-message"
                  />
                </div>

                <button type="submit" className="submit-button">
                  Register
                </button>
                <p className="alreadyuser">
                  Already a User?{" "}
                  <a onClick={() => navigate("/login")}>Login</a>
                </p>
              </Form>
            </Formik>
          </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default Register;
