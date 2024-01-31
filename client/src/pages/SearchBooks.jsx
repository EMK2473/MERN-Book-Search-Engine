import { useState, useEffect } from "react";
import { Container, Col, Form, Button, Card, Row } from "react-bootstrap";

import Auth from "../utils/auth";
// bring in mutation hooks
import { useMutation } from "@apollo/client";
import { SAVE_BOOK } from "../utils/mutations";

const searchGoogleBooks = (query) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};

// import { saveBook, searchGoogleBooks } from '../utils/API';
import { saveBookIds, getSavedBookIds } from "../utils/localStorage";

const SearchBooks = () => {
  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");
  // call mutation
  const [saveBook] = useMutation(SAVE_BOOK);

  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  // modified use effect to only call saveBooks when savedBookIds changes
  useEffect(() => {
    saveBookIds(savedBookIds);
    console.log("Saved Book Ids:", savedBookIds);
  }, [savedBookIds]);
  

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ["No author to display"],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || "",
      }));

      setSearchedBooks(bookData);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a book to our database
  const handleSaveBook = async (bookId) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    console.log("token:", token)
    if (!token) {
      return false;
    }
  
    try {
      setSavedBookIds((prevSavedBookIds) => [...prevSavedBookIds, bookToSave.bookId]);
  
      const { data } = await saveBook({
        variables: { newBook: bookToSave },
      });
  
      // Ensure data.saveBook._id is defined and unique before updating the state
      if (data?.saveBook?._id && !savedBookIds.includes(data.saveBook._id)) {
        setSavedBookIds((prevSavedBookIds) => [...prevSavedBookIds, data.saveBook._id]);
      }
    } catch (err) {
      setSavedBookIds((prevSavedBookIds) =>
        prevSavedBookIds.filter((savedBookId) => savedBookId !== bookToSave.bookId)
      );
  
      console.error("Save Book Mutation Error:", err);
    }
  };

  console.log("savedBookId:", savedBookIds)
  
  return (
    <>
      <div className="text-light bg-dark p-5" fluid="true">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a book"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className="pt-5">
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : "Search for a book to begin"}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {Auth.loggedIn() && (
                   <Button
                   disabled={savedBookIds?.some(
                     (savedBookId) => savedBookId === String(book.bookId)
                   )}
                   className="btn-block btn-info"
                   onClick={() => handleSaveBook(book.bookId)}
                 >
                   {savedBookIds?.some(
                     (savedBookId) => savedBookId === String(book.bookId)
                   )
                     ? "This book has already been saved!"
                     : "Save this Book!"}
                 </Button>
                 
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;
