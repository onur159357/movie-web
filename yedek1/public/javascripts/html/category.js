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

export { categoryHtml };