class ApiConnect {
    constructor(apiUrl, method, contentType, ...postData) {
        this.apiUrl = apiUrl;
        this.method = method;
        this.contentType = contentType;
        this.postData = postData[0];
    };
    
    connectGet() {
        return new Promise((resolve, reject) => {
            fetch(this.apiUrl , {
                method : this.method,
                headers:{
                    'Content-Type': this.contentType,
                    },

            }).then((data) => {
                resolve(data.json());

            });

        });
        
    };
    connectPost() {
        return new Promise((resolve, reject) => {
            const data = this.postData;
            fetch(this.apiUrl , {
                method : this.method,
                headers:{
                    'Content-Type': this.contentType,

                    },
                body : JSON.stringify(data),

            }).then((data) => {
                resolve(data.json());

            });

        });
        
    };

};

class ApiMethods {
    constructor(id, urlDetail, ...postData){
        this.id = id;
        this.urlDetail = urlDetail;
        this.postData = postData[0];
        this.url = 'http://localhost:3000';

    };

    get(){
        return new Promise((resolve, reject) => {
            const getMethod = new ApiConnect(`${this.url}/${this.urlDetail}/`, 'GET', 'application/json');
            getMethod.connectGet()
                .then((data) => {
                    resolve(data);

                }).catch((err) => {
                    console.log(err);

                })
        });

    };

    getId(){
        return new Promise((resolve, reject) => {
            const getIdMethod = new ApiConnect(`${this.url}/${this.urlDetail}/${this.id}`, 'GET', 'application/json');
            getIdMethod.connectGet()
                .then((data) => {
                    resolve(data);

                }).catch((err) => {
                    console.log(err);

                });
        
        });

    }

    post(){
        return new Promise((resolve, reject) => {
            const postMethod = new ApiConnect(`${this.url}/${this.urlDetail}/`, 'POST', 'application/json', this.postData);
            postMethod.connectPost()
                .then((data) => {
                    resolve(data);

                }).catch((err) => {
                    console.log(err);

                })
        })
        

    }

    put() {
        return new Promise((resolve, reject) => {
            const putMethod = new ApiConnect(`${this.url}/${this.urlDetail}/${this.id}`, 'PUT', 'application/json', this.postData);
            putMethod.connectPost()
                .then((data) => {
                    resolve(data);

                }).catch((err) => {
                    console.log(err);

                })
        })
        
    }

    delete(){
        return new Promise((resolve, reject) => {
            const deleteMethod = new ApiConnect(`${this.url}/${this.urlDetail}/${this.id}`, 'DELETE', 'application/json');
            deleteMethod.connectGet()
                .then((data) => {
                    resolve(data);

                }).catch((err) => {
                    console.log(err);

                });
        })
        
    }

}

class ApiCall {
    constructor(id, urlDetail, ...postData) {
        this.id = id;
        this.postData = postData[0];
        this.urlDetail = urlDetail;

    }
    Api(method) {
        const searchApi = new ApiMethods(this.id, this.urlDetail, this.postData);
        let sectionApi;
        switch(method) {
            case 'GET':
                sectionApi = searchApi.get();
                break;
            case 'GETID':
                sectionApi = searchApi.getId();
                break;
            case 'POST':
                sectionApi = searchApi.post();
                break;
            case 'PUT':
                sectionApi = searchApi.put();
                break;
            case 'DELETE':
                sectionApi = searchApi.delete();
                break;
            default:
                throw new Error(` "${method}" no such method has been defined`);
                
        }
        return sectionApi;
    }

}

//Url Control
const pathName = window.location.pathname.split('/').pop();
const urlId = window.location.search.substr(1);
//err message tag
const errMsgTag = document.getElementById('errMessage');

// ========================= CATEGORY POST PUT DELETE ========================= //
//public category
function apiCategory(id, urlDetail, ...postData){
    const category = new ApiCall(id, urlDetail, ...postData);
    return category;

}
 //category options
 function categoryOption(){
    apiCategory('', 'category').Api('GET')
    .then((data) => {
        //HTML Add
        categoryAdd(data).then((data) => {
            document.getElementById('category').innerHTML = data;

            if(pathName === 'category-add.html')
                document.getElementById('category-edit').innerHTML = data;

        });
    });
}
//Add Cat
function addCat() {
    const postData = {
        category_sub_number : document.getElementById('category').value,
        category_name : document.getElementById('category-name').value,
        category_description : document.getElementById('category-description').value,
    }

    apiCategory('', 'category', postData).Api('POST')
    .then((data) => {
        if(data.category_name === undefined) {
            errMsgTag.innerHTML = data;

        } else {
            errMsgTag.innerHTML = ` ${data.category_name} Başarıyla kaydedildi `;

        }

        categoryOption();

    })
}
//Put Cat
function catPut() {
    const category = document.getElementById('category').options;
    const sectionNo = document.getElementById('category').selectedIndex;
    const catId = category[sectionNo].getAttribute('id');
    const catName = category[sectionNo].text;

    const postData = {
        category_sub_number : document.getElementById('category-edit').value,
        category_name : document.getElementById('category-name-edit').value,
        category_description : document.getElementById('category-description-edit').value,

    }

    apiCategory(catId, 'category', postData).Api('PUT')
    .then((data) => {
        if(postData.category_name.length !== 0)
            errMsgTag.innerHTML = `<i>${catName}</i> isimli kategori <i>${postData.category_name}</i> olarak değiştirildi.`;

        if(data.err)
            errMsgTag.innerHTML = data.err
        
        if(oldCatDesc !== postData.category_description) {
            if(oldCatDesc.length > 0 && postData.category_description.length <= 0) {
                errMsgTag.insertAdjacentHTML('beforeend', ` <i>${oldCatDesc}</i> Boş olarak kaydedildi `);

            } else if(oldCatDesc === 0 && postData.category_description.length > 0) {
                errMsgTag.insertAdjacentHTML('beforeend', ` Boş olan açıklama <i>${postData.category_description}</i> olarak değiştirildi `);

            } else {
                errMsgTag.insertAdjacentHTML('beforeend', ` <i>${oldCatDesc} açıklama <i>${postData.category_description}</i> olarak değiştirildi `);

            }

        }

        categoryOption();

    }).catch((err) => {
        errMsgTag.innerHTML = err;

    })
}
//Category Delete
function deleteCat() {
    const category = document.getElementById('category').options;
    const sectionNo = document.getElementById('category').selectedIndex;
    const catId = category[sectionNo].getAttribute('id');

    apiCategory(catId, 'category',).Api('DELETE')
    .then((data) => {
        categoryOption();
        errMsgTag.innerHTML = `${data.category_name} Kategorisi Silindi`;
        
    }).catch((err) => {
        console.log(err);
    
    })
}
if(pathName === 'category-add.html') {
   //category options
    categoryOption();

    //Category Add
    document.querySelectorAll('.save-cat-btn')[0].addEventListener('click', addCat);

    //Put change html
    const categorySelect = document.getElementById('category');
    categorySelect.addEventListener('change', () => {
        const category = document.getElementById('category').options;
        const sectionNo = document.getElementById('category').selectedIndex;
        const catId = category[sectionNo].getAttribute('id');

        apiCategory(catId, 'category').Api('GETID')
        .then((data) => {
            for(let i = 0; i < category.length; i++) {
                if(category[i].value == data[0].category_sub_number) {
                    document.getElementById('category-edit').selectedIndex = [i];

                }
                
            }
            document.getElementById('category-name-edit').value = data[0].category_name;
            document.getElementById('category-description-edit').value = data[0].category_description;

        })

    })

    //Category Put
    const oldCatDesc = document.getElementById('category-description').value;
    document.querySelectorAll('.edit-cat-btn')[0].addEventListener('click', catPut);

    //Category Delete
    document.querySelectorAll('.delete-cat-btn')[0].addEventListener('click', deleteCat);
}

// ========================= DIRECTOR POST PUT DELETE ========================= //

function apiDirector(id, urlDetail, ...postData){
    const director = new ApiCall(id, urlDetail, ...postData);
    return director;
}
// GET All -- DELETE -- PUT -- Director
function director() {
    apiDirector('', 'director').Api('GET')
    .then((data) => {
        //html add
        directorAdd(data).then((data) => {
            //GET Director
            document.querySelectorAll('.director-form-list > ul')[0].innerHTML = data;
            
        }).then((data) => {
            // DELETE director
            let deleteBtn = document.querySelectorAll('.director-delete');
            
            for(let i = 0; i < deleteBtn.length; i++) {
                deleteBtn[i].addEventListener('click', () => {
                    let deleteId = deleteBtn[i].value;

                    apiDirector(deleteId, 'director').Api('DELETE')
                        .then((data) => {
                            errMsgTag.innerHTML = `${data.director_name} ${data.director_surname} İsimli Yönetmen Silindi`;
                            director();

                        }).catch((err) => {
                            console.log(err);

                        })

                })
            }

            //PUT director
            let editBtn = document.querySelectorAll('.director-edit');
            let editTag = document.querySelectorAll('.editTag');
            let closeBtn = document.querySelectorAll('.director-edit-close');
            let saveBtn = document.querySelectorAll('.director-edit-save');

            for(let i = 0; i < editBtn.length; i++) {
                editBtn[i].addEventListener('click', () => {
                    for(let x = 0; x < editTag.length; x++) {
                        editTag[x].style.display = 'none';

                        if(editBtn[i].value == editTag[x].id){
                            editTag[x].style.display = 'block';
                            closeBtn[x].addEventListener('click', () => {
                                editTag[x].style.display = 'none';

                            })

                        }

                    }

                });
                //PUT save
                saveBtn[i].addEventListener('click', () => {
                    putDirector(saveBtn[i].value, 'director');
                    editTag.forEach(element => {
                        element.style.display = 'none';

                    });

                });
            }

        })

    }).catch((err) => {
        console.log(err);

    });

}
// POST Director
function directorPost() {
    let postData = {
        director_name : document.getElementById('director-name').value,
        director_surname : document.getElementById('director-surname').value,
        director_age : document.getElementById('director-age').value,
        director_rate : document.getElementById('director-rate').value,
        director_biography : document.getElementById('director-biography').value,

    }

    apiDirector('', 'director', postData).Api('POST')
    .then((data) => {
        // required control and msg
        if(data.errors) {
            let errMessage = new String();
            for(key in data.errors) {
                if(key === 'director_name') {
                    errMessage +=` <p>Ad</p> `;

                } else if (key === 'director_surname' ) {
                    errMessage +=` <p>Soyad</p>`;

                }
                errMsgTag.innerHTML = ` ${errMessage} Zorunludur`;

            };

        } else {
            errMsgTag.innerHTML = ` ${data.director_name}  ${data.director_surname} isimli yönetmen kaydedildi `;
            director();
        }

    }).catch((err) => {
        console.log(err);

    });

}
//PUT Director
function putDirector(id, urlDetail) {
    let editSection = document.getElementById(`${id}`);
    let editContent = {
        director_name : editSection.querySelectorAll(':scope li #director-name')[0].value,
        director_surname : editSection.querySelectorAll(':scope li #director-surname')[0].value, 
        director_age : editSection.querySelectorAll(':scope li #director-age')[0].value,
        director_rate : editSection.querySelectorAll(':scope li #director-rate')[0].value,
        director_biography : editSection.querySelectorAll(':scope li #director-biography')[0].value,

    }

    apiDirector(id, urlDetail, editContent).Api('PUT')
    .then((data) => {
        errMsgTag.innerHTML = ` ${data.director_name} ${data.director_surname} isimli yönetmen hakkında düzenleme yapıldı `
        director();
    }).catch((err) => {
        console.log(err);

    })
}
//director option -- inner html director id
function directorOption(){
    apiDirector('', 'director').Api('GET')
    .then((data) => {
        directorOptionHtml(data)
        .then((data) => {
            document.getElementById('director').innerHTML = data;

        })
    }).catch((err) => {
        console.log(err);

    })

}
if(pathName === 'director-add.html'){
    // GET All -- DELETE -- PUT -- Director
    director();
    // POST Director
    document.querySelectorAll('.director-save')[0].addEventListener('click', directorPost);
}
// ========================= MOVIE POST PUT DELETE ========================= //

function apiMovie(id, urlDetail, ...postData) {
    const movie = new ApiCall(id, urlDetail, ...postData);
    return movie;
}
 //moviePost
 function moviePost(apiUrl, method) {
    function data(){
        return new Promise((resolve, reject) => {
            let formData = new FormData();
            
            let movieImg = document.getElementById('movie-img').files[0];
            let movieVideo = document.getElementById('movie-video').files[0];
            let movieCountry = document.getElementById('movie-country').value;
            let movieYear = document.getElementById('movie-year').value;
            let imdbScore = document.getElementById('imdb-score').value;
            //director id
            let directorOption = document.getElementById('director');
            let directorSelected = document.getElementById('director').selectedIndex;
            let directorId = directorOption[directorSelected].id;
            //Category Id
            let categoryOption = document.getElementById('category');
            let categorySelected = document.getElementById('category').selectedIndex;
            let categoryId = categoryOption[categorySelected].id;
            //Append Data
            formData.append('movie_name', document.getElementById('movie-name').value);
            formData.append('category', categoryId);
            formData.append('director', directorId);
            formData.append('movie_country', movieCountry);
            formData.append('movie_year', movieYear);
            formData.append('imdb_score', imdbScore);
            
            if(movieImg !== undefined)
                formData.append('movie_img', movieImg);
            
            if(movieVideo !== undefined)
                formData.append('movie_video', movieVideo);

            resolve(formData);

        });

    }
    data().then((data) => {
        fetch(apiUrl , {
            method : method,
            headers:{
                'Accept': 'application/json',

                },
            body : data,

        }).then( (data) => {
            return data.json();

        }).then((data) => {            
            if(data.errors) {
                if(data.errors.director)
                    errMsgTag.insertAdjacentHTML('beforeend', ` <p>Yönetmen seçmek zorundasınız</p> `);
                
                if(data.errors.category)
                    errMsgTag.insertAdjacentHTML('beforeend', `<p> Kategori seçmek zorundasınız</p> `);
    
                if(data.errors.movie_name)
                    errMsgTag.insertAdjacentHTML('beforeend', `<p> Video adı girmek zorundasınız</p> `);
    
                if(data.errors.movie_img)
                    errMsgTag.insertAdjacentHTML('beforeend', `<p> Video resmi girmek zorundasınız</p> `);

            } else {
                errMsgTag.insertAdjacentHTML('beforeend', `<p> ${data.movie_name} başarıyla kaydedildi </p> `);
                if(pathName === 'movie-add.html')
                    movieGet();

            }

            console.log(data);
            
        }).catch( (err) =>{
            console.log(err);

        });

    }); 
}
//Movie Get
function movieGet() {
    return new Promise((resolve, reject) => {
        apiMovie('', 'movie').Api('GET').then((data) => {
            return data;

        }).then((data) => {
            movieAddHtml(data).then((data) => {
                document.querySelectorAll('.movie-container')[0].innerHTML = data;

            }).then((data) => {
                //Movie Delete
                if(pathName === 'movie-add.html') {
                    let deleteBtn = document.getElementsByClassName('delete-movie-btn');
                
                    for(let i = 0; i < deleteBtn.length; i++){
                        deleteBtn[i].addEventListener( 'click', () => {
                            movieDelete(deleteBtn[i].value);
                            movieGet();

                        });

                    }

                    //Movie Put
                    let editBtnMovie = document.getElementsByClassName('edit-movie-btn');

                    for(let i = 0; i < editBtnMovie.length; i++){
                        editBtnMovie[i].addEventListener('click', () => {
                            window.open(`movie-edit.html?${editBtnMovie[i].value}`, '',);

                            
                        })

                    }            
                    
                }
                
            }).catch((err) => {
                reject(err);

            })

        }).catch((err) => {
            console.log(err);

        })
        
    })
    
}
//Movie get Id 
function movieGetId(movieId){
    return new Promise((resolve, reject) => {
        apiMovie(movieId, 'movie').Api('GETID').then((data) => {
            resolve(data);

        }).catch((err) => {
            console.log(err);

        })

    })
    
}
//Movie Delete
function movieDelete(deleteId) {
    apiMovie(deleteId, 'movie').Api('DELETE')
    .then((data) => {
        return data;

    }).then((data) => {
        errMsgTag.innerHTML = `${data.movie_name} isimli video başarıyla silindi`;
        movieGet();

    }).catch((err) => {
        console.log(err);

    })
}
//Movie PUT
function moviePut(putId, data){
    apiMovie(putId, 'movie', data).Api('PUT').then((data) => {
        console.log(data);

    }).catch((err) => {
        console.log(err);

    })

};

if(pathName === 'movie-add.html') {
    //category select option
    categoryOption();
    //Director select option
    directorOption();
    //movie post
    document.getElementById('save-video').addEventListener('click', () => {
        moviePost('http://localhost:3000/movie/', 'POST')
    });
    //movie Get
    movieGet();

}
if(pathName === 'movie-edit.html') {
    //category select option
    categoryOption();
    //Director select option
    directorOption();
    //movie getId date add
    function moviePutHtml() {
        return new Promise((resolve, reject) => {
            movieGetId(urlId).then((data) => {
                document.getElementById('img-content').setAttribute('src', `http://localhost:3000/uploads/${data.movie_img}`);
                document.getElementById('movie-name').value = data.movie_name;
                document.getElementById('movie-country').value = data.movie_country;
                document.getElementById('imdb-score').value = data.imdb_score;
    
                // Date Set
                let movieDate = new Date(data.movie_year),
                    year = movieDate.getFullYear(),
                    month = movieDate.getMonth(),
                    day = movieDate.getDate();
    
                    if(month < 10)
                        month = `0${month}`;
    
                    if(day < 10)
                        day = `0${day}`;
                
                document.getElementById('movie-year').value = `${year}-${month}-${day}`;
                //Video set
                let movieTag = `
                    <video width="200" controls="">
                        <source id="video-content" src="http://localhost:3000/uploads/${data.movie_video}" type="video/mp4">
                    </video>
                    `
                ;
                document.getElementById('video-content').innerHTML = movieTag;
                
                //category director selected
                let category = document.getElementById('category');
                let director = document.getElementById('director');
    
                function selectedHtml(selectId, id) {
                    let option = selectId.options;
                    for(let i = 0; i < option.length; i++) {
                        if(option[i].id === id)
                            selectId.selectedIndex = [i];
    
                    }
    
                }
    
                selectedHtml(category, data.category);
                selectedHtml(director, data.director);
    
                resolve(data);
            });

        })
        
    }

    moviePutHtml().then(() => {

        document.getElementById('edit-save-video').addEventListener('click', () => {
            moviePost(`http://localhost:3000/movie/${urlId}`, 'PUT');

        })

    });
}
// ========================= HTML CREATE ========================= //

//category add (select)
function categoryAdd(data) {
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
//directorr add (select)
function directorAdd(data){
    return new Promise((resolve, reject) => {
        let director = `<li>
                            <div>Sıra</div>
                            <div>Ad</div>
                            <div>Soyad</div>
                            <div>Yaş</div>
                            <div>Puanı</div>
                            <div>Biografi</div>
                            <div> Düzenle </div>
                            <div>Sil</div>
                        </li>`;

        function nested(data) {
            for(let i = 0; i < data.length; i++) {
                let directorAge = new Date(data[i].director_age),
                    year = directorAge.getFullYear(),
                    month = directorAge.getMonth() + 1,
                    day = directorAge.getDate();

                if(month < 10)
                    month = '0' + month;

                if(day < 10)
                    day = '0' + day;

                director += `<li>
                        <div> ${i} </div>
                        <div> ${data[i].director_name} </div>
                        <div> ${data[i].director_surname} </div>
                        <div> ${data[i].director_age} </div>
                        <div> ${data[i].director_rate} </div>
                        <div> ${data[i].director_biography} </div>
                        <div> <button type="submit" value="${data[i]._id}" class="director-edit">Düzenle</button> </div>
                        <div> <button type="submit" value="${data[i]._id}" class="director-delete">Sil</button> </div>
                        <section id='${data[i]._id}' class='editTag director-form-edit ${data[i]._id}'>
                            <ul>
                                <li>
                                    <label>Ad</label>
                                    <input type='text' id='director-name' value ='${data[i].director_name}'>
                                </li>
                                <li>
                                    <label>Soyad</label>
                                    <input type='text' id='director-surname' value='${data[i].director_surname}'>
                                </li>
                                <li>
                                    <label>Yaş</label>
                                    <input type='date' id='director-age' value='${year}-${month}-${day}'>

                                </li>
                                <li>
                                    <label>Puanı</label>
                                    <input type='number' step='0.1' id='director-rate' value='${data[i].director_rate}'>
                                </li>
                                <li>
                                    <label>Biografi</label>
                                    <textarea id='director-biography' cols='30' rows='10'>${data[i].director_biography}</textarea>
                                </li>
                                <li>
                                    <button type="submit" value="${data[i]._id}" class="director-edit-save">Kaydet</button>
                                    <button type="submit" class="director-edit-close">İptal</button>
                                </li>
                            </ul>
                        </section>
                    </li>`

            }

        };

        nested(data);
        resolve(director);

    });

};
function directorOptionHtml(data){
    return new Promise((resolve, reject) => {
        let deneme = `<option> Yönetmen Seçin </option>`;

       data.forEach((element, index) => {
           deneme +=  `
                <option id='${element._id}'>
                    ${element.director_name} ${element.director_surname} 
                </option>
            `;
       })
        resolve(deneme); 
    })
}
//movie get add html 
function movieAddHtml(data){
    return new Promise((resolve, reject) => {
        let movieBox = '';

        data.forEach((element, index) => {
            let catName = 'Kategori yok',
                director_name = 'Yönetmen yok',
                movieImg = 'no-picture.png',
                movieVideo = 'boş video ekle',
                imdbScore = 'Puan verilmemiş',
                movieYear = 'Tarih girilmemiş';

            if(element.category)
                catName = element.category.category_name;

            if(element.director_name)
                director_name = element.director_name;

            if(element.movie_img)
                movieImg = element.movie_img;

            if(element.movie_video)
                movieVideo = element.movie_video;

            if(element.imdb_score)
                imdbScore = element.imdb_score;

            if(element.movie_year)
                movieYear = element.movie_year;

            movieBox += `
                <div class="movie-box">
                    <div class="movie-img">
                        <img src="http://localhost:3000/uploads/${movieImg}">
                    </div>
                    <div class="movie-video">
                        <video width="400" controls>
                            <source src="http://localhost:3000/uploads/${movieVideo}" type="video/mp4">
                        </video>
                    </div>
                    <ul>
                        <li class="movie-name">${element.movie_name}</li>
                        <li class="movie-country">${element.movie_country}</li>
                        <li class="movie-imdb">
                            <span>İmdb Puanı</span>
                            <span>${imdbScore}</span>
                        </li>
                        <li class="movi-year">${movieYear}</li>
                        <li class="movie-director">
                            <span><b>YÖNETMEN</b></span>
                            <span>${director_name}</span>
                        </li>
                        <li class="movie-category">
                            <span><b>KATEGORİ</b></span>
                            <span>${catName}</span>
                        </li>
                    </ul>
                    <button type="submit" class="edit-movie-btn" value="${element._id}">Düzenle</button>
                    <button type="submit" class="delete-movie-btn" value="${element._id}">Sil</button>
                </div>
            `;

        });

        resolve(movieBox);

    })

}