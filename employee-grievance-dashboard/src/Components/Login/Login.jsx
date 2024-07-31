import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../FormStyles/formStyles.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { PacmanLoader, MoonLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().required("Required"),
});

const Login = () => {
  const { login, loading, auth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/dashboard");
    }
  }, [auth, navigate]);

  return (
    <div className="form-body-login">
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
            <h2 className="head-1">Login</h2>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                const response = await login(values.email, values.password);
                {
                  response === "Login failed" &&
                    toast.error("Usermail or Password is incorrect !!");
                }
                // navigate("/dashboard");
              }}
            >
              <Form>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Field type="email" id="email" name="email" />
                  <ErrorMessage
                    name="email"
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

                <button type="submit" className="submit-button">
                  Login
                </button>
                <p className="alreadyuser">
                  New User?{" "}
                  <a onClick={() => navigate("/register")}>Register</a>
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

export default Login;
