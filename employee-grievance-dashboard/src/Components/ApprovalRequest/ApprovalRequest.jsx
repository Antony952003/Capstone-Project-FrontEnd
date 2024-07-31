import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { format } from "date-fns";
import Modal from "../Modal/Modal";
import "./ApprovalRequest.css";
import { IoTimeOutline } from "react-icons/io5";
import apiClient from "../../ApiClient/apiClient";
import AOS from "aos";
import "aos/dist/aos.css";

const ApprovalRequests = () => {
  const { auth } = useContext(AuthContext);
  const [approvalRequests, setApprovalRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    request: null,
    action: null,
  });
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchApprovalRequests = async () => {
      try {
        const response = await apiClient.get(
          "http://localhost:7091/api/ApprovalRequest/GetAllApprovalRequests",
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        console.log(response.data);
        setApprovalRequests(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch approval requests:",
          error.response?.data?.message || error.message
        );
      }
    };

    if (auth) {
      fetchApprovalRequests();
    }
  }, [auth]);

  const handleRowClick = (request) => {
    setSelectedRequest(request);
  };

  const handleCloseModal = () => {
    setSelectedRequest(null);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "do MMMM yyyy h:mm a");
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleApprove = (event, request) => {
    event.stopPropagation();
    setConfirmationModal({
      isOpen: true,
      request,
      action: "approve",
    });
  };

  const handleReject = (event, request) => {
    event.stopPropagation();
    setConfirmationModal({
      isOpen: true,
      request,
      action: "reject",
    });
  };

  const handleConfirmAction = async () => {
    const { request, action } = confirmationModal;
    try {
      const endpoint =
        action === "approve"
          ? `http://localhost:7091/api/ApprovalRequest/ApproveRequest?id=${request.approvalRequestId}`
          : `http://localhost:7091/api/ApprovalRequest/RejectRequest?id=${request.approvalRequestId}`;

      await axios.post(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );

      setApprovalRequests((prevRequests) =>
        prevRequests.map((r) =>
          r.approvalRequestId === request.approvalRequestId
            ? { ...r, status: action === "approve" ? 1 : 2 }
            : r
        )
      );

      setConfirmationModal({ isOpen: false, request: null, action: null });
      setSelectedRequest(null);
    } catch (error) {
      console.error(
        `Failed to ${action} request:`,
        error.response?.data?.message || error.message
      );
    }
  };

  const filteredRequests = approvalRequests.filter((request) => {
    if (filter === "all") return true;
    if (filter === "pending") return request.status === 0;
    if (filter === "approved") return request.status === 1;
    if (filter === "rejected") return request.status === 2;
    return true;
  });

  return (
    <div className="approval-requests content-container">
      <h2 data-aos="fade-down">Approval Requests</h2>
      <div data-aos="fade-left" className="filter-container">
        <label htmlFor="filter"></label>
        <select id="filter" value={filter} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <table className="approval-table" data-aos="fade-right">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Reason</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((request) => (
            <tr
              key={request.approvalRequestId}
              onClick={() => handleRowClick(request)}
            >
              <td>{request.approvalRequestId}</td>
              <td>{request.employeeName}</td>
              <td
                className={
                  (request.status === 0 && "pending") ||
                  (request.status === 1 && "approved") ||
                  (request.status === 2 && "rejected")
                }
              >
                {request.status === 0 && "Pending"}
                {request.status === 1 && "Approved"}
                {request.status === 2 && "Rejected"}

                {request.status === 0 && <IoTimeOutline className="timeicon" />}
              </td>
              <td className="ellipsis">{request.reason}</td>
              <td>
                {request.status === 0 ? (
                  <>
                    <button
                      className="approve-button"
                      onClick={(event) => handleApprove(event, request)}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-button"
                      onClick={(event) => handleReject(event, request)}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span>No actions available</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={!!selectedRequest}
        onClose={handleCloseModal}
        content={
          selectedRequest && (
            <div className="modal-content">
              <p>
                <strong>ID:</strong> {selectedRequest.approvalRequestId}
              </p>
              <p>
                <strong>Name:</strong> {selectedRequest.employeeName}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedRequest.status === 0 && "Pending"}
                {selectedRequest.status === 1 && "Approved"}
                {selectedRequest.status === 2 && "Rejected"}
              </p>
              <p>
                <strong>Reason:</strong> {selectedRequest.reason}
              </p>
              <p>
                <strong>Requested Date:</strong>{" "}
                {formatDate(selectedRequest.requestDate)}
              </p>
            </div>
          )
        }
      />
      {confirmationModal.isOpen && (
        <Modal
          isOpen={confirmationModal.isOpen}
          onClose={() =>
            setConfirmationModal({ isOpen: false, request: null, action: null })
          }
          content={
            <div className="modal-content">
              <p>
                Are you sure you want to{" "}
                <strong
                  className={
                    confirmationModal.action === "approve"
                      ? "approved"
                      : "rejected"
                  }
                >
                  {confirmationModal.action === "approve"
                    ? "approve"
                    : "reject"}
                </strong>{" "}
                the request from {confirmationModal.request.employeeName}?
              </p>
              <div className="popup-btns">
                <button
                  className="approve-button"
                  onClick={handleConfirmAction}
                >
                  Confirm{" "}
                  {confirmationModal.action === "approve"
                    ? "Approval"
                    : "Rejection"}
                </button>
                <button
                  className="reject-button"
                  onClick={() =>
                    setConfirmationModal({
                      isOpen: false,
                      request: null,
                      action: null,
                    })
                  }
                >
                  Cancel
                </button>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};

export default ApprovalRequests;
