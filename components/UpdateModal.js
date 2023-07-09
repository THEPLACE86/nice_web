import React from "react";

const UpdateModal = ({ show, onClose }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>업데이트 알림</h2>
                <p>업데이트가 있습니다. 새로고침해주세요.</p>
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};

export default UpdateModal;