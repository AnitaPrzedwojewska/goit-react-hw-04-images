import css from "./App.module.css";
import { useState, useEffect } from "react";
import { INITIAL_STATE } from "./constants/initial-image-finder";
import { Searchbar } from "./components/Searchbar/Searchbar";
import { Loader } from "./components/Loader/Loader";
import { fetchImages } from "./api/pixabay-api";
import { ImageGallery } from "./components/ImageGallery/ImageGallery";
import { Button } from "./components/Button/Button";
import { Modal } from "./components/Modal/Modal";

function App() {
  const [query, setQuery] = useState(INITIAL_STATE.query);
  const [images, setImages] = useState(INITIAL_STATE.images);
  const [page, setPage] = useState(INITIAL_STATE.page);
  const [loading, setLoading] = useState(INITIAL_STATE.loading);
  const [info, setInfo] = useState(INITIAL_STATE.info);
  const [error, setError] = useState(INITIAL_STATE.error);
  const [more, setMore] = useState(INITIAL_STATE.more);
  const [modal, setModal] = useState(INITIAL_STATE.modal);
  const [image, setImage] = useState(INITIAL_STATE.image);
  const [tags, setTags] = useState(INITIAL_STATE.tags);

  const initialNewQuery = () => {
    setQuery(INITIAL_STATE.query);
    setImages(INITIAL_STATE.image);
    setPage(INITIAL_STATE.page);
    setLoading(INITIAL_STATE.loading);
    setInfo(INITIAL_STATE.info);
    setError(INITIAL_STATE.error);
  };

  const handleSubmitQuery = (event) => {
    event.preventDefault();
    initialNewQuery();
    const words = event.target.keywords.value;
    if (words.trim() === "") {
      setError("Please enter what you are looking for!");
      return;
    }
    const query = words.split(" ").join("+");
    setQuery(query);
    event.target.reset();
  };

  const loadImages = (query, page) => {
    try {
      fetchImages(query, page)
      .then((result) => {
        const total = result.totalHits;
        const images = result.hits;
        images.map(({ id, webformatURL, tags, largeImageURL }) => {
          id, webformatURL, tags, largeImageURL;
        });
        if (images.length === 0) {
          setMore(false);
          setError(`Sorry, there are no images matching '${query}'. Please try again.`);
          return;
        }
        setImages((prevImages) => ([...prevImages, ...images]));
        setInfo(`Hurray! We founded ${total} images matching '${query}'.`);
        total > page * 12
          ? setMore(true)
          : setMore(false);
      });
    } catch (error) {
      setError("Sorry, something went wrong, please try again later.");
    } finally {
      setLoading(false);
    }
  }

  const handleClickMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleShowModal = (event) => {
    const large = event.target.getAttribute("data-large");
    const tags = event.target.alt;
    setModal(true);
    setImage(large);
    setTags(tags);
  };

  const handleCloseModal = () => {
    setModal(false);
    setImage(INITIAL_STATE.image);
    setTags(INITIAL_STATE.tags);
  };

  useEffect(
    () => {
      if (!query) return;
      setLoading(true);
      loadImages(query, page);
    },
    [query, page]
  )

  return (
    <>
      <div className={css.App}>
        <Searchbar onSubmit={handleSubmitQuery}></Searchbar>
        {loading && <Loader />}
        {error && <p className={css.text}>{error}</p>}
        {info && <p className={css.text}>{info}</p>}
        {!error && images.length > 0 && (
          <ImageGallery
            images={images}
            onClick={handleShowModal}></ImageGallery>
        )}
        {more && <Button onClick={handleClickMore} />}
        {modal && (
          <Modal
            image={image}
            tags={tags}
            onCloseModal={handleCloseModal}
          />
        )}
      </div>
    </>
  );
}

export default App;
