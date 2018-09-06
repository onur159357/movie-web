function menuHtml(data){
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
const categoryGet = () => {
    return new Promise((resolve, reject) =>{
        fetch('http://localhost:3000/category/', {
            method: 'GET', // or 'PUT'
            headers:{
            'Content-Type': 'application/json'
            }
        }).then((data) => {
            resolve (data.json());
        }).catch((err) => {
           resolve (err) //document.getElementById('menu').innerHTML = `menü gelmedi ${err} `;
        });
    })
};

categoryGet()
    .then((data) => {
        return menuHtml(data);
    }).then((data) => {
        document.getElementById('menu').innerHTML = data;
    }).catch((err) => {
        document.getElementById('menu').innerHTML = `menü gelmedi ${err} `;
    })


    