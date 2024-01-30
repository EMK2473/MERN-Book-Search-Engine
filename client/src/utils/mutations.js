import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// Include:
// ADD_USER
// template tag gql` `
// define: mutation($value1: valueType, $value2: valueType)
// call: mutation(key: $value1, key2: $value2 )
// requesting fields/nested object queries
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        bookCount
        savedBooks {
          authors
          bookId
          image
          link
          title
          description
        }
      }
    }
  }
`;
// SAVE_BOOK
// template tag gql` `
// define: mutation($value1: valueType, $value2: valueType)
// call: mutation(key: $value1, key2: $value2 )
// export const SAVE_BOOK = gql`
// mutation saveBook()
// `
export const SAVE_BOOK = gql`
  mutation saveBook($newBook: InputBook!) {
    saveBook(newBook: $newBook) {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;

// template tag gql` `
// define: mutation($value: valueType, $value2: valueType)
// call: mutation(key: $value, key2: $value2 )
// REMOVE_BOOK

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: ID!) {
    removeBook(bookId: $bookId) {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;

// new SEARCH_BOOKS query
export const SEARCH_BOOKS = gql`
  query searchBooks($searchTerm: String!) {
    searchBooks(searchTerm: $searchTerm) {
      id
      volumeInfo {
        authors
        title
        description
        imageLinks {
          thumbnail
        }
      }
    }
  }
`;