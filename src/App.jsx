import { Component } from "react";
import css from "./app.module.css";
import { INITIAL_STATE } from "./constants/initial-image-finder";
import { Searchbar } from "./components/searchbar/searchbar";
import { Loader } from "./components/loader/loader";
import { fetchImages } from "./api/pixabay-api";
import { ImageGallery } from "./components/imageGallery/imageGallery";
import { Button } from "./components/button/button";
import { Modal } from "./components/modal/modal";

function App() {
  const [state, setState] = useState(INITIAL_STATE);

  const setNewQuery = () => {
    setState({
      query: INITIAL_STATE.query,
      images: INITIAL_STATE.images,
      page: INITIAL_STATE.page,
      pages: INITIAL_STATE.pages,
      info: INITIAL_STATE.info,
      error: INITIAL_STATE.error,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setNewQuery();
    const words = event.target.keywords.value;
    if (words.trim() === "") {
      setState({ error: "Please enter what you are looking for!" });
      return;
    }
    const query = words.split(" ").join("+");
    setState({
      query: query,
    });
    event.target.reset();
  };

  async loadImages(query, page) {
    try {
      await fetchImages(query, page).then((result) => {
        // console.log("result: ", result);
        const total = result.totalHits;
        const images = result.hits;
        images.map(({ id, webformatURL, tags, largeImageURL }) => {
          id, webformatURL, tags, largeImageURL;
        });
        if (images.length === 0) {
          setState({ more: false });
          setState({
            error: `Sorry, there are no images matching '${state.query}'. Please try again.`,
          });
          return;
        }
        setState((prevState) => ({
          images: [...prevState.images, ...images],
          info: `Hurray! We founded ${total} images matching '${state.query}'.`,
        }));
        total > state.page * 12
          ? setState({ more: true })
          : setState({ more: false });
      });
    } catch (error) {
      // console.log(error);
      setState({
        error: "Sorry, something went wrong, please try again later",
      });
    } finally {
      setState({ loading: false });
    }
  }

  const handleMore = () => {
    setState((prevState) => ({
      page: prevState.page + 1,
    }));
  };

  const handleModal = (event) => {
    // event.preventDefault();
    if (!state.modal) {
      const large = event.target.getAttribute("data-large");
      const tags = event.target.alt;
      // console.log("large: ", large);
      // console.log("tags: ", tags);
      setState({
        modal: true,
        image: large,
        tags: tags,
      });
    } else {
      setState({
        modal: false,
        image: INITIAL_STATE.image,
        tags: INITIAL_STATE.tags,
      });
    }
  };

  const useEffect() {

  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (
  //     state.page !== prevState.page ||
  //     state.query !== prevState.query
  //   ) {
  //     setState({ loading: true });
  //     loadImages(state.query, state.page);
  //   }
  // }

  return (
    <>
      <div className={css.App}>
        <Searchbar onSubmit={handleSubmit}></Searchbar>
        {/* {console.log("state: ", state)} */}
        {state.loading && <Loader />}
        {state.error && <p className={css.text}>{state.error}</p>}
        {state.info && <p className={css.text}>{state.info}</p>}
        {!state.error && state.images.length > 0 && (
          <ImageGallery
            images={state.images}
            onClick={handleModal}></ImageGallery>
        )}
        {state.more && <Button onClick={handleMore} />}
        {state.modal && (
          <Modal
            image={state.image}
            tags={state.tags}
            onClick={handleModal}
          />
        )}
      </div>
    </>
  );
}

export default App;
