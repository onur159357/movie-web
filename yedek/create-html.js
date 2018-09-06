//Create movie html
const movieDetailHtml = (data) => {
    //title
    const categoryTitle = document.getElementsByClassName('categoryTitle');
    const dataTitle = document.createTextNode(data[0].category_name);
    categoryTitle[0].appendChild(dataTitle);
    //movie
    console.log(data);
    const movie = data[0].movie;
    const movieContainer = document.getElementsByClassName('movie-container');
    let html = new String;
    for (let i = 0; i < movie.length; i++) {
           html += `<div class="movieBox">
                        <div class="imgBox">
                            <img src="http://localhost:3000/uploads/${movie[i].movie_img}" width="150">
                        </div>
                        <div class="videoBox">
                            <video width="400" controls>
                                <source src="http://localhost:3000/uploads/${movie[i].movie_video}" type="video/mp4">
                            </video>
                        </div>
                        <div class="movieName">
                            <span><b>Video Adı: </b></span>
                            <span>${movie[i].movie_name}</span>
                        </div>
                        <div class="director">
                            <span><b>Yönetmen : </b></span>
                            <span>${movie[i].director}</span>
                        </div>
                        <div class="movieYear">
                            <span><b>Tarihi : </b></span>
                            <span>${movie[i].movie_year}</span>
                        </div>
                    </div>`;
    }
    movieContainer[0].innerHTML = html;
};