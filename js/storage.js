// Export the user object so other files can use it
export const user = JSON.parse(localStorage.getItem('user')) || {
    books: [], 
    genres: [], 
    locations: ['Bookshelf', 'Kindle'], 
    wishlist: []
};

// Export other constants
export const genres = ['Philosophy', 'Fiction', 'History', 'Geography', 'Horror', 'Novel', 'Non-fiction', 'Classic'];
export const readingStatuses = ['Read', 'Reading', 'Unread'];

// Export a variable that other files can modify
export let filteredBooks = [...user.books];

export function updateFilteredBooks(books) {
    filteredBooks = books;
}

export function updateUserData(){
    localStorage.setItem('user', JSON.stringify(user));
}

export function updateUserGenres(){
    user.genres = [];
    
    user.books.forEach(book => {
        book.categories.forEach(category => {
            if(!user.genres.includes(category)){
                user.genres.push(category);
            }
        });
    });
    
    updateUserData();
}

export function addBook(bookObj){
    if(!bookObj.title || !bookObj.title.trim()) {
        alert('Book must have a title');
        return false;
    }
    
    if(user.books.findIndex(book => book.id === bookObj.id) !== -1){
        alert('Book already in library!');
        return false;
    }
    
    user.books.push(bookObj);
    updateUserData();
    updateUserGenres();
    return true;
}

export function deleteBook(bookID){
    const bookIndex = user.books.findIndex(e => e.id === bookID);
    user.books.splice(bookIndex, 1);
    updateUserData();
    updateUserGenres();
}

export function addToWishlist(book){
    if(user.books.findIndex(e => e.id === book.id) !== -1){
        alert('You already own this book!');
        return;
    }
    
    if(user.wishlist.findIndex(e => e.id === book.id) === -1){
        user.wishlist.push(book);
        alert('Book added to wishlist!');
    } else {
        alert('Book already in wishlist!');
    }
    
    updateUserData();
}

export function saveNewLocation(location) {
    if (!location || !location.trim()) {
        alert('Please enter a location name');
        return false;
    }
    if (user.locations.includes(location)) {
        alert('Location already exists');
        return false;
    }
    user.locations.push(location.trim());
    updateUserData();
    return true;
}