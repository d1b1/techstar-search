// CustomModal.js
import React from 'react';
import Modal from 'react-modal';

const CustomModal = ({ isOpen, onRequestClose, content }) => (
  <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
    <button onClick={onRequestClose}>Close</button>
    {content}
  </Modal>
);

export default CustomModal;