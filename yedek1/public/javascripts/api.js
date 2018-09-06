//page-url
const pathName = window.location.pathname.split('/').pop();

//console.log(window.location.search, pathName);

//Category
document.addEventListener("DOMContentLoaded", categoryApi );

if(pathName === 'index.html') {
    document.addEventListener('DOMContentLoaded', movieApi);
    document.addEventListener('DOMContentLoaded', directorApi);
}
//Save and Delete Category
if(pathName === 'category-add.html') {
    document.addEventListener('DOMContentLoaded', categoryAdd);
    //Save Category

    document.querySelectorAll('.saveCatBtn')[0].addEventListener('click', ()=> {
        
        const data = {
            category_sub_number : document.getElementById('category').value,
            category_name : document.getElementById('category_name').value,
            category_description : document.getElementById('category_description').value,
        };

        fetch('http://localhost:3000/category/', {
            method : 'POST',
            headers : {
                'Accept' :'application/json, text/plain, */*' ,
                'Content-type' :'application/json',

            },
            body : JSON.stringify({category_sub_number, category_name, category_description} = data),

        }).then((response) => {
            //Category
            const errMessage = response.json();
            return errMessage;

        }).then((data) => {
            if(data.category_name === undefined) {
                document.getElementById('errMessage').innerHTML = data;
            } else {
                document.getElementById('errMessage').innerHTML = ` ${data.category_name} Başarıyla kaydedildi `;
            }
            
            categoryApi();
            categoryAdd();

        }).catch((err) => {
            console.log(err);

        });
    
        

    });
    //Delete Category
    document.querySelectorAll('.deleteCatBtn')[0].addEventListener('click', () => {
        const data = {
            categoryOption : document.getElementById('category').options,
            categorySelected : document.getElementById('category').selectedIndex,
            deleteCategoryId : categoryOption[categorySelected].getAttribute('id'),
        }

        fetch(`http://localhost:3000/category/${data.deleteCategoryId}`, {
            method : 'DELETE',
            headers : {
                'Accept' :'application/json, text/plain, */*' ,
                'Content-type' :'application/json',
            },
            body : JSON.stringify({deleteCategoryId} = data),

        }).then((response) => {
            const errMessage = response.json();
            return errMessage;

        }).then((data) => {
            document.getElementById('errMessage').innerHTML = `${data.category_name} Kategorisi Silindi`;
            categoryApi();
            categoryAdd();

        }).catch((err) => {
            console.log(err);

        })

    });
    //Put Category
    document.querySelectorAll('.editCatBtn')[0].addEventListener('click', ()=> {
        let categoryOption = document.getElementById('category').options,
            categorySelected = document.getElementById('category').selectedIndex,
            editCategoryId = categoryOption[categorySelected].getAttribute('id');

        fetch(`http://localhost:3000/category/${deleteCategoryId}`, {
            method : 'PUT',
            headers : {
                'content-type' : 'application/json',
            },
            body : JSON.stringify({})
        })
    })
}
//category api
function categoryApi (){
    const categoryTag = document.querySelectorAll('nav > ul')[0];
    apiConnect('http://localhost:3000/category/', 'GET', 'application/json', categoryTag, categoryHtml)
        .then((data) => {
            //category detail api
            categoryClick();

        }).catch((err) => {
            console.log(err);

        });
}
//category add 
function categoryAdd() {
    const categoryTag = document.getElementById('category');
    apiConnect('http://localhost:3000/category/', 'GET', 'application/json', categoryTag, categoryAddHtml);

}
//movie api
function movieApi() {
    const movieTag = document.querySelectorAll('.movie-container')[0];
    apiConnect('http://localhost:3000/movie/', 'GET', 'application/json', movieTag, movieList);

}

//Director Api
function directorApi() {
    const directorTag = document.querySelectorAll('.director-container')[0];
    apiConnect('http://localhost:3000/director/', 'GET', 'application/json', directorTag, directorHtml);

}

//API CONNECTION FUNCTION
const apiConnect = (apirUrl, method, contentType, appendHtml, createHtml) => {
    return new Promise((resolve, reject) => {
        fetch(apirUrl , {
                method : method,
                headers:{
                    'Content-Type': contentType,
                    }
            }
        ).then((data) => {
            return data.json();

        }).then((data) => {
            return createHtml(data);

        }).then((html) => {
           appendHtml.innerHTML = html;
           resolve(html);

        }).catch((err) => {
            reject(err);

        })
    })
}
// CATEGORY CREATE HTML
function categoryHtml(data){
    return new Promise((resolve, reject) => {
        let category = new String();
        function nested(data, startId) {
            for(let i = 0; i < data.length; i++) {
                if(data[i].category_sub_number === startId) {
                    category += `<li>
                                    <a href ='${data[i]._id} ' 
                                        category_sub_number = ' ${data[i].category_sub_number} ' > 
                                        ${data[i].category_name}
                                    </a>`;

                        //Subcategory controler
                        let controler = false;    
                        for(let x = 0; x < data.length; x++) {
                            if(data[i].category_id === data[x].category_sub_number) {
                                controler = true;
                                break;

                            }

                        }
                        if(controler) {
                            category += `<ul class = 'subCat'>`;
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
//CATEGORY ADD HTML
function categoryAddHtml(data){
    return new Promise((resolve, reject) => {
        let category = new String();
        function nested(data, startId) {
            category += `<option id ='0' value = ' 0' > 
                            Ana Katagori
                        </option>`;  

            for(let i = 0; i < data.length; i++) {
                    category += `<option id ='${data[i]._id}'
                                    value = ' ${data[i].category_id} ' > 
                                    ${data[i].category_name}
                                 </option>`;

            }

        }
        nested(data, 0);
        
        resolve(category);
    });

}
//CATEGORY CLICK MOVIE
function categoryClick() {
    return new Promise((resolve, reject) => {
        const aTag = document.querySelectorAll("nav.category li a ");

        for(let i = 0; i < aTag.length; i++) {
            aTag[i].addEventListener('click', function(e){
                const aHref = aTag[i].attributes.href.nodeValue;
                const categoryTag = document.querySelectorAll('.movie-container')[0];
                apiConnect(`http://localhost:3000/category/${aHref}`, 'GET', 'application/json', categoryTag, movieDetail);

				e.preventDefault();
				//preventDefault() Bir bağlantının URL'yi açmasını önleyin
				e.stopPropagation();
                //stopPropagation() çalışan functionun içindeki nesneleri etkilemesi engellenir
                
            }, false);
            
        }

    });

}
 //MOVIE CREATE HTML
 const movieHtml = (movie) => {
        let html = '';
        for (let i = 0; i < movie.length; i++) {
            html += `<div class="movieBox">
                        <div class="imgBox">
                            <a href ="/movie-detail.html?${movie[i]._id}">
                                <img src="http://localhost:3000/uploads/${movie[i].movie_img}" width="150">
                            </a>
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
                        <form action="" method='delete'>
                            <button type="submit">Sil gitsin</button>
                        </form>
                    </div>`;

        }
        return html;
    
 } 
 //movie list
 const movieList = (data) => {
    const movie = data;
    return  movieHtml(movie);
}
//movie detail
const movieDetail = (data) => {
    const movie = data[0].movie;
    return  movieHtml(movie);
}

//DIRECTOR HTML
const directorHtml = (data) => {
    let html = new String();
    for(let i = 0; i < data.length; i++) { 
        html += `
        <div class="director-box">
            <div class="director"> ${data[i].director_name} </div>
            <div class="director-surname"> ${data[i].director_surname} </div>
            <div class="director-rate"> ${data[i].director_rate} </div>
            <div class="director-surname"> ${data[i].director_age} </div>
        </div>
        `;
    }
    return html;
}