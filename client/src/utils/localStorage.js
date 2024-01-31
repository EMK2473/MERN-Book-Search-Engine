export const getSavedBookIds = () => {
  const savedBookIds = localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_books'))
    : [];

  return savedBookIds;
}; // checks if there is any data saved under the key 'saved_books' in local storage.
// If data is found, it parses and returns the array of saved book IDs; otherwise, it returns an empty array.

export const saveBookIds = (bookIdArr) => {
  if (bookIdArr.length) {
    localStorage.setItem('saved_books', JSON.stringify(bookIdArr));
  } else {
    localStorage.removeItem('saved_books');
  }
}; // checks if the array has any elements. If it does. it saves the array to local storage under "saved_books" after converting to JSON
// If the array is empty, it removes the 'saved_books' key from local storage.

export const removeBookId = (bookId) => {
  const savedBookIds = localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_books'))
    : null;

  if (!savedBookIds) {
    return false;
  }

  const updatedSavedBookIds = savedBookIds?.filter((savedBookId) => savedBookId !== bookId);
  localStorage.setItem('saved_books', JSON.stringify(updatedSavedBookIds));

  return true;
}; // retrieves the current saved book IDS from local storage
// if no saved book ids, then returns false
// filters out the specified bookID from the array
// saves the updated array in local storage
