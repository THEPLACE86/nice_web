import React from "react";
import tw from "twin.macro";
import styled from "styled-components";

const ModalBackground = styled.div`
  ${tw`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50`}
`;

const ModalContainer = styled.div`
  ${tw`bg-white rounded-lg p-8`}
`;

const Modal = ({ children, onClose }) => {
    return (
        <ModalBackground onClick={onClose}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                {children}
            </ModalContainer>
        </ModalBackground>
    );
};

export default Modal;
