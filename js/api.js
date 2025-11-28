const API_KEY = 'AIzaSyABeY9VBDmPih7W8nOf5zndu9I5MtF0wfQ';

export async function searchBook(query){
    try {
        const searchURL = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}`;
        const response = await fetch(searchURL);
        const data = await response.json();
        return data;
    } catch (error){
        console.error('Search error:', error);
        alert('Failed to search books. Please try again.');
        throw error;
    }
}