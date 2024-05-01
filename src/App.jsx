import css from "./App.module.css";
import { useState } from 'react';
import { useEffect } from "react";
import { INITIAL_STATE } from "./constants/initial-image-finder";
import { Searchbar } from "./components/Searchbar/Searchbar";
import { Loader } from "./components/Loader/Loader";
import { fetchImages } from "./api/pixabay-api";
import { ImageGallery } from "./components/ImageGallery/ImageGallery";
import { Button } from "./components/Button/Button";
import { Modal } from "./components/Modal/Modal";

function App() {
  console.log('App is running...');

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
    console.log("initialNewQuery is running...");
    setQuery(INITIAL_STATE.query);
    setImages(INITIAL_STATE.image);
    setPage(INITIAL_STATE.page);
    setLoading(INITIAL_STATE.loading);
    setInfo(INITIAL_STATE.info);
    setError(INITIAL_STATE.error);
  };

  const handleSubmit = (event) => {
    console.log('handleSubmit is running...')
    event.preventDefault();
    initialNewQuery();
    const words = event.target.keywords.value;
    if (words.trim() === "") {
      setError("Please enter what you are looking for!");
      return;
    }
    const query = words.split(" ").join("+");
    console.log('handleSubmit - query: ', query);
    setQuery(query);
    event.target.reset();
  };

  const loadImages = (query, page) => {
    console.log('loadImages is running...');
    try {
      fetchImages(query, page)
      .then((result) => {
        console.log("result: ", result);
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
      setError("Sorry, something went wrong, please try again later");
    } finally {
      setLoading(false);
    }
  }

  const handleMore = () => {
    console.log("handleMore is running...");
    setPage(prevPage => prevPage + 1);
  };

  const handleModal = (event) => {
    console.log("handleModal is running...");
    // event.preventDefault();
    if (!modal) {
      const large = event.target.getAttribute("data-large");
      const tags = event.target.alt;
      setModal(true);
      setImage(large);
      setTags(tags);
    } else {
      setModal(false);
      setImage(INITIAL_STATE.image);
      setTags(INITIAL_STATE.tags);
    }
  };

  useEffect(
    () => {
      if (!query) return;
      console.log("useEffect is running...");
      setLoading(true);
      console.log('useEffect - query / page: ', query, ' / ', page);
      loadImages(query, page);
    },
    [query, page]
  )

  // componentDidUpdate(prevProps, prevState) {
  //   if (
  //     state.page !== prevState.page ||
  //     state.query !== prevState.query
  //   ) {
  //     setState({ loading: true });
  //     loadImages(state.query, state.page);
  //   }
  // }

  console.log('query: ', query);
  console.log('images: ', images);
  console.log('page: ', page);
  console.log('loading: ', loading);

  return (
    <>
      <div className={css.App}>
        <Searchbar onSubmit={handleSubmit}></Searchbar>
        {loading && <Loader />}
        {error && <p className={css.text}>{error}</p>}
        {info && <p className={css.text}>{info}</p>}
        {!error && images.length > 0 && (
          <ImageGallery
            images={images}
            onClick={handleModal}
          >
            </ImageGallery>
        )}
        {more && <Button onClick={handleMore} />}
        {modal && (
          <Modal
            image={image}
            tags={tags}
            onClick={handleModal}
          />
        )}
      </div>
    </>
  );
}

export default App;
