import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

// bring in hooks/queries/mutations
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';

// remove API call
// import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  const userData = data ? data.me : {};

  // Check if the user is authenticated
  if (!Auth.loggedIn()) {
    // Redirect to the login page or handle unauthorized access
    // Example: <Redirect to="/login" />
    return <h2>Please log in to view your saved books.</h2>;
  }

  

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    try {
      const response = await removeBook({
        variables: { bookId }
      });

      const updatedUser = response.data.removeBook;
      // setUserData(updatedUser);
      // no need to call setUserData
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };


// if data isn't here yet, say so
if (!userData || !userData.savedBooks) {
  return <h2>LOADING...</h2>;
}


  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
  {userData.savedBooks.map((book) => {
    return (
      <Col key={book.bookId} md="4">
        <Card border='dark'>
          {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
          <Card.Body>
            <Card.Title>{book.title}</Card.Title>
            <p className='small'>Authors: {book.authors}</p>
            <Card.Text>{book.description}</Card.Text>
            <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
              Delete this Book!
            </Button>
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

export default SavedBooks;
