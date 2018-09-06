// Api function
const callApi = (apiUrl, method, contentType) => {
    return new Promise((resolve, reject) => {
        fetch(apiUrl, {
            method : method,
            headers:{
                'Content-Type': contentType,
                }
        }).then((data) =>{
            resolve (data.json());
        }).catch((err) => {
            resolve (err)
        })
    })
};

// CATEGORY CREATE HTML
function categoryHtml(data){
    return new Promise((resolve, reject) => {
        let category = new String();
        function nested(data, startId) {
            for(let i = 0; i < data.length; i++) {
                if(data[i].category_sub_number === startId) {
                    category += `<li><a href ='category-detail.html?${data[i]._id} ' 
                                    category_sub_number = ' ${data[i].category_sub_number} ' > ${data[i].category_name} </a>`;
                    //Subcategory controler
                    let controler = false;    
                    for(let x = 0; x < data.length; x++) {
                        if(data[i].category_id === data[x].category_sub_number) {
                            controler = true;
                            break;

                        }

                    }

                    if(controler) {
                        category += `<ul>`;
                        nested(data, data[i].category_id);
                        category += `</ul>`;
                    }      

                    category += `</li>`;

                };

            }
        }
        nested(data, 0);
       
        resolve(category);
    })
}
//MOVIE HTML
const movieHtml = (data) => {
    const movie = data;
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
   return html;
}
//DIRECTOR HTML
const directorHtml = (data) => {
    let html = new String();
    for(let i = 0; i < data.length; i++) {
        //yaş hesaplama
        function calculateAge(birthMonth, birthDay, birthYear) {
            todayDate = new Date();
            todayYear = todayDate.getFullYear();
            todayMonth = todayDate.getMonth();
            todayDay = todayDate.getDate();
            age = todayYear - birthYear;
            
            if (todayMonth < birthMonth - 1) {
                age--;
            }
            
            if (birthMonth - 1 == todayMonth && todayDay < birthDay) {
                age--;
            }
            return age;
        }
        let date = new Date(data[i].director_age)
        calculateAge(date.getMonth() + 1, date.getDate(), date.getFullYear());

        html += `
        <div class="director-box">
            <div class="director"> ${data[i].director_name} </div>
            <div class="director-surname"> ${data[i].director_surname} </div>
            <div class="director-age"> ${age} </div>
        </div>
        `;
    }
    return html;
}

callApi('http://localhost:3000/category/', 'GET', 'application/json')
    .then((data) => {
        return categoryHtml(data);
    }).then((data) => {
        document.getElementsByClassName('category')[0].insertAdjacentHTML('afterbegin', data);
        return callApi('http://localhost:3000/movie/', 'GET', 'application/json');
    }).then((data) => {
        return movieHtml(data);
    }).then((data) => {
        document.getElementsByClassName('movie-container')[0].insertAdjacentHTML('afterbegin', data);
        return callApi('http://localhost:3000/director/', 'GET', 'application/json')
    }).then((data) => {
        return directorHtml(data);
    }).then((data) => {
        document.getElementsByClassName('director-container')[0].insertAdjacentHTML('afterbegin', data);
    }).catch((err) => {
        console.log(err);
    });