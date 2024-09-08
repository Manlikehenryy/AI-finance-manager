import React from "react";

const Modal = ({ id, title, onClose, children, onSubmit, loading }) => {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box text-gray-900">
        <h3 className="font-bold text-lg ">{title}</h3>
        <form onSubmit={onSubmit} className="py-4">
          {/* Render the passed form fields */}
          {children}

          {/* Form Actions */}
          <div className="modal-action">
            <button
              type="submit"
              disabled={loading}
              className="btn text-white hover:bg-gray-600 bg-gray-700"
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Submit"
              )}
            </button>
            <button
              type="button"
              className="btn text-white hover:bg-[#fdb436] bg-[#F59E0B]"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default Modal;
