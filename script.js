const container = document.getElementById('container');

function generateStartScreen(){
    const title = document.createElement('h2');
    title.classList.add('start-screen-title');
    title.innerText = "Book collection App";

    const createNewLibraryBtn = document.createElement('button');
    createNewLibraryBtn.classList.add('new-library-btn');
    createNewLibraryBtn.innerText = 'Create New Library';

    createNewLibraryBtn.addEventListener('click', () => {
        createProfile()
    })

    const uploadLibraryBtn = document.createElement('button');
    uploadLibraryBtn.classList.add('upload-library-btn');
    uploadLibraryBtn.innerText = 'Upload Existing Library';

    const btnHolder = document.createElement('div');
    btnHolder.classList.add('start-screen-btn-holder');
    btnHolder.style.border = '1px solid black';

    btnHolder.appendChild(createNewLibraryBtn);
    btnHolder.appendChild(uploadLibraryBtn);

    container.appendChild(title);
    container.appendChild(btnHolder);
}

function createProfile(){
    container.innerHTML = '';

    const profileCard = document.createElement('div');
    profileCard.classList.add('profile-card');

    const profilePicture = document.createElement('div');
    profilePicture.classList.add('profile-picture');
    profilePicture.style.backgroundSize = 'contain'
    profilePicture.style.backgroundPosition = 'center';

    const profilePicturesHolder = document.createElement('div');
    profilePicturesHolder.classList.add('profile-pictures-holder');
    
    defaultProfilePictures.forEach(picture => {
        const pictureDiv = document.createElement('div');
        pictureDiv.classList.add('pfp');

        pictureDiv.style.backgroundImage = `url('${picture.url}')`;
        pictureDiv.style.backgroundPosition = 'center';
        pictureDiv.style.backgroundRepeat = 'no-repeat';
        pictureDiv.style.backgroundSize = 'contain';

        profilePicturesHolder.appendChild(pictureDiv);

        pictureDiv.addEventListener('click', () => {
            const pics = document.querySelectorAll('.pfp')
            pics.forEach(pic => {
                pic.classList.remove('selected-pic');
            })
            pictureDiv.classList.add('selected-pic');

            const selectedPic = document.querySelector('.selected-pic');
            profilePicture.style.backgroundImage = selectedPic.style.backgroundImage;
        })
    })


    const name = document.createElement('input');
    name.type = 'text';

    profileCard.appendChild(profilePicture);
    profileCard.appendChild(profilePicturesHolder);
    profileCard.appendChild(name);

    container.appendChild(profileCard);
}

function saveProfile(profilePicture, name){
    user.name = name;
    user.profilePicture = `url('${profilePicture}')`;
}

const defaultProfilePictures = [
    {name: 'thorfinn', url: 'https://i.pinimg.com/736x/66/a3/d2/66a3d23902ea634936cbd3c3c523f1c1.jpg'},
    {name: 'musashi', url: 'https://i.pinimg.com/736x/73/56/08/735608b60b4de86bbfbf7adedffdc854.jpg'},
    {name: 'mugen', url: 'https://i.pinimg.com/736x/0a/af/34/0aaf34b5ee8e05345a13196ede815d4d.jpg'},
    {name: 'jin', url: 'https://i.pinimg.com/1200x/d1/3e/41/d13e41da95b3416e669f4dbc7e8e0624.jpg'},
    {name: 'spike', url: 'https://i.pinimg.com/736x/7e/4c/45/7e4c457ae4ba547cd5616aaa825953f6.jpg'},
    {name: 'guts', url: 'https://i.pinimg.com/736x/07/33/3a/07333a56d4c0da5dc5afb5a365906872.jpg'},
    {name: 'okdabe', url: 'https://i.pinimg.com/736x/5e/6b/ee/5e6beeb749ec884b9dc6ac4dd2657142.jpg'},
];

const user = {
    name: null,
    profilePicture: null
}

generateStartScreen()