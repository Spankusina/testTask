const urlAPI = "https://hacker-news.firebaseio.com/v0/newstories.json";
let loadedStories = []

async function getJson(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Произошла ошибка при загрузке данных");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Произошла ошибка при загрузке данных:", error);
  }
}



function timeConvert(time) {
  const date = new Date(time * 1000);
  return date.toLocaleString("en-GB");
}

export { getJson, timeConvert, loadedStories, urlAPI };
