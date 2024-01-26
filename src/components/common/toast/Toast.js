import React from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer, toast } from 'react-toastify';

const types = {
  success: toast.TYPE.SUCCESS,
  danger: toast.TYPE.ERROR,
  warning: toast.TYPE.WARNING
};

export const notify = (props) => {
  const { type, message, autoClose, draggable } = props;

  const toastType = types[type];

  toast(message.message, {
    autoClose: autoClose || 3000,
    draggable: draggable || false,
    closeButton: false,
    hideProgressBar: true,
    type: toastType
  });
};

export default function Toast() {
  return <ToastContainer />;
}
