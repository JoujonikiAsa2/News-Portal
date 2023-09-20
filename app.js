const ShowBtn = document.getElementById("show-all");
let categoryIdToShow = null;
let isShowingAll = false;
let sortFlag = false;
const sortBtn = document.querySelector("#sortBtn");

sortBtn.addEventListener("click", function () {
  sortFlag = true;
  fetchAndDisplayNews();
  console.log(sortFlag);
});
const handleCategories = async () => {
  const res = await fetch(
    "https://openapi.programming-hero.com/api/news/categories"
  );
  const data = await res.json();
  const news_category = data.data.news_category;

  const tabContainer = document.getElementById("tab-container");
  tabContainer.innerHTML = "";

  news_category.forEach((category) => {
    const categoryContainer = document.createElement("div");
    categoryContainer.innerHTML = `
        <a onclick="handleCategoryNews('${category.category_id}')" class="tab">${category.category_name}</a>`;
    tabContainer.appendChild(categoryContainer);
  });

  handleCategoryNews(news_category[0].category_id); // Load the first category initially
};

const fetchAndDisplayNews = async () => {
  toggleLoading(true);
  let url = `https://openapi.programming-hero.com/api/news/category/${categoryIdToShow}`;

  const res = await fetch(url);
  const data = await res.json();
  toggleLoading(false);

  const cardContainer = document.getElementById("card-container");

  cardContainer.innerHTML = ""; // Clear existing news

  if (data.data.length > 3 && !isShowingAll) {
    data.data = data.data.slice(0, 3);
    ShowBtn.classList.remove("hidden");
  } else {
    ShowBtn.classList.add("hidden");
  }

  if (sortFlag) {
    data.data.sort((a, b) => b.total_view - a.total_view);
    sortFlag = false;
  }
  // data.data.sort((a, b) => b.total_view - a.total_view);

  data.data.forEach((news) => {
    const div = document.createElement("div");
    div.innerHTML = `<div class="card w-96 bg-base-100 shadow-xl">
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
        <h3> Total Views: ${news.total_view ? news.total_view : "No Views"}</h3>
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
    cardContainer.appendChild(div);
  });

  if (cardContainer.children.length === 0) {
    cardContainer.textContent =
      "There is no news. Please find another category!";
  }
};

const toggleLoading = (isLoading) => {
  const loading = document.getElementById("spinner");
  if (isLoading) {
    loading.classList.remove("hidden");
  } else {
    loading.classList.add("hidden");
  }
};

const handleCategoryNews = async (categoryId) => {
  console.log(categoryId);
  categoryIdToShow = categoryId;
  isShowingAll = false;
  fetchAndDisplayNews();
};

ShowBtn.addEventListener("click", () => {
  isShowingAll = true;
  fetchAndDisplayNews();
});

handleCategories();
