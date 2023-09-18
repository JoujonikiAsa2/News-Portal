const handleCategories = async (isShowAll) => {
  const res = await fetch('https://openapi.programming-hero.com/api/news/categories')
  const data = await res.json();
  const news_category = data.data.news_category;

  // connect with tab-container div
  if (!isShowAll) {
    const tabContainer = document.getElementById('tab-container')
    news_category.forEach((category) => {
      console.log(category, isShowAll)
      const categoryContainer = document.createElement('div');
      categoryContainer.innerHTML = `
            <a onclick="handleCategoryNews('${category.category_id}',${isShowAll})" class="tab">${category.category_name}</a>`;
      tabContainer.appendChild(categoryContainer);
      console.log(categoryContainer)
      console.log(`'${category.category_id}'`)
    });
  }
  else {
    news_category.forEach((category) => {
      console.log(category, isShowAll)
      handleCategoryNews(`'${category.category_id}'`, isShowAll)
      console.log(`'${category.category_id}'`)
    });
  }
};


// show news by categoryId
const handleCategoryNews = async (categoryId, isShowAll) => {
  toggleLoading(true)

  const res = await fetch(`https://openapi.programming-hero.com/api/news/category/${categoryId}`)
  const data = await res.json();
  toggleLoading(false)

  // connect with card container
  const cardContainer = document.getElementById('card-container');

  // connect with show more button
  const button = document.getElementById('show-all')

  // making the field empty when another link clicked
  cardContainer.textContent = "";

  if (data.data.length > 3 && !isShowAll) {
    data.data = data.data.slice(0, 3)
    button.classList.remove('hidden');
  }
  else {
    button.classList.add('hidden');

  }

  // fetching the data of news by foreach loop
  data.data.forEach((news) => {

    // Creating a card for showing the news details
    const div = document.createElement('div');
    div.innerHTML =
      `<div class="card w-96 bg-base-100 shadow-xl">
                    <figure>
                        <img src=${news?.image_url}/>
                    </figure>
                    <div class="card-body">
                        <h2 class="card-title">
                        ${news.title.slice(0, 20)}
                            <div class="badge badge-secondary p-5">${news?.rating?.badge}</div>
                        </h2>
                        <p>
                            ${news.details.slice(0, 50)}
                        </p>
                        <h3> totoal viws: ${news.total_view ? news.total_view : "no vviews"
      }</h3>
                        <div class="card-footer flex justify-between items-center mt-3">
                            <div class="flex items-center">
                                <div class="p-3">
                                    <div class="avatar online">
                                        <div class="w-14 rounded-full">
                                            <img
                                            src=${news.author?.img}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h6>${news.author?.name}</h6>
                                    <small>2022-08-24 17:27:34</small>
                                </div>
                            </div>
                            <div class="card-detaild-btn">
                                <button onclick=handleModal('${news._id}')
                                    class="inline-block cursor-pointer rounded-md bg-gray-800 px-4 py-3 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-900">
                                    Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
    
            `;

    // apend the card in card container div 
    cardContainer.appendChild(div);
  })

  // Cheacking if any news missing 
  if (cardContainer.textContent == "") {
    cardContainer.textContent = "There is no news. Please find another category!"
  }
}

// loading spinner for showing that the data is loaded
const toggleLoading = (isloading) => {
  const loading = document.getElementById('spinner');
  if (isloading) {
    loading.classList.remove('hidden')
  }
  else {
    loading.classList.add('hidden')
  }
}

// showallnews by clicking the show all button
const showAllBtn = () => {
  handleCategories(true)
}

// calling the handleCategories function
handleCategories()
handleCategoryNews('04')














