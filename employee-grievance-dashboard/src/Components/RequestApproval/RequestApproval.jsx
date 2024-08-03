import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiClient from "../../ApiClient/apiClient";
import { AuthContext } from "../../contexts/AuthContext";
import RequestCard from "./RequestCard";
import { PacmanLoader } from "react-spinners";

const RequestApproval = () => {
  const [comment, setComment] = useState("");
  const { auth } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchUserRequests = async () => {
      try {
        const response = await apiClient.get(
          `/ApprovalRequest/GetAllUserApprovalRequests`,
          {
            headers: {
              Authorization: `Bearer ${auth?.accessToken}`,
            },
          }
        );
        console.log(response.data);
        setRequests(response.data);
      } catch (error) {
        console.log(
          `Unable to fetch the user request ${error?.response?.data?.details}`
        );
        toast.error(
          `Unable to fetch the user request ${error?.response?.data?.details}`
        );
      } finally {
        setLoading(false); // Set loading to false after data is fetched or error occurs
      }
    };
    if (auth != null) {
      fetchUserRequests();
    } else {
      setLoading(false); // Set loading to false if auth is null
    }
  }, [auth]);

  const handleRequestApproval = async () => {
    try {
      const response = await apiClient.post(
        `/ApprovalRequest/CreateApprovalRequest`,
        { reason: comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log(response.data);
      toast.success(`Approval Request has been made for ${auth?.user?.name} successfully !! 
        Wait until Admin approves it`);
    } catch (error) {
      console.error(
        "Failed to create an approval request: ",
        error.response?.data?.details || error.message
      );
      toast.error(
        <>
          <span
            style={{
              color: "red",
              fontSize: "15px",
              fontWeight: "600",
              marginBottom: "10px",
            }}
          >
            Failed to Request Approval
          </span>
          <br />
          <p
            style={{
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            <span
              style={{
                color: "red",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Reason:{" "}
            </span>
            {error.response?.data?.details || error.message}
          </p>
        </>
      );
    }
    setComment("");
  };

  const isAnyRequestApproved = requests.some((request) => request.status === 1);

  return (
    <>
      {!loading ? (
        <>
          <div className="request-approval-container">
            <h2 id="request-head">Request Approval</h2>
            <p>
              Status :{" "}
              <span className={auth?.user?.isApproved ? "green" : "red"}>
                {auth?.user?.isApproved ? "Approved" : "NotApproved"}
              </span>
            </p>
            <p>
              Role :{" "}
              <span className={auth?.user?.role && "red"}>
                {auth?.user?.role}
              </span>
            </p>
            <>
              {requests.length !== 0 && (
                <div className="request-card-container">
                  {requests.length !== 0 &&
                    requests.map((request) => (
                      <RequestCard
                        key={request.approvalRequestId}
                        approvalRequest={request}
                      />
                    ))}
                </div>
              )}
              {(requests.length === 0 || !isAnyRequestApproved) && (
                <div className="request-section" data-aos="fade-up">
                  Make Request
                  <textarea
                    className="request-comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Enter your comments here..."
                  />
                  <button id="make-request" onClick={handleRequestApproval}>
                    Submit Request
                  </button>
                </div>
              )}
            </>
          </div>
        </>
      ) : (
        <div className="loader-container-request">
          <PacmanLoader
            color="#007bff"
            cssOverride={{}}
            loading
            margin={0}
            speedMultiplier={1}
          />
        </div>
      )}
    </>
  );
};

export default RequestApproval;
