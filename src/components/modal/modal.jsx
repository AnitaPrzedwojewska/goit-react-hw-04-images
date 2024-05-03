import css from "./Modal.module.css";
import { useEffect } from "react";
import PropTypes from 'prop-types';

export const Modal = ({ image, tags, onCloseModal }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Escape") {
        onCloseModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  const handleOutsideClick = (event) => {
    if (event.target.nodeName !== "IMG") {
      onCloseModal();
    }
  };

  return (
    <div
      className={css.Overlay}
      onClick={handleOutsideClick}>
      <div className={css.Modal}>
        <img className={css.ModalImage} src={image} alt={tags} />
      </div>
    </div>
  );
};

Modal.propTypes = {
  image: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  onCloseModal: PropTypes.func.isRequired
};