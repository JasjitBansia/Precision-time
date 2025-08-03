document.getElementById("logo-icon").addEventListener("click", () => {
  setTimeout(() => {
    if (window.location.href === "https://www.youtube.com/") {
      window.location.reload();
    }
  }, 100);
});
document
  .getElementsByClassName("ytd-yoodle-renderer")[0]
  .addEventListener("click", () => {
    window.location.href = "https://www.youtube.com/";
  });
function load() {
  result = document.getElementsByTagName("ytd-rich-item-renderer");
}
load();
setInterval(() => {
  load();
  homeVideos(result);
  focusedVideo();
}, 5000);

async function returnTimeDifference(videoID) {
  try {
    let reqData = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoID}&key=`
    );
    let json = await reqData.json();
    let publishedDate = new Date(json.items[0].snippet.publishedAt).getTime();
    return ((new Date().getTime() - publishedDate) / 86400000 / 365).toFixed(1);
  } catch (error) {}
}
async function homeVideos(videoCollection) {
  if (!window.location.href.startsWith("https://www.youtube.com/@")) {
    try {
      let videoArray = Array.from(videoCollection);
      videoArray.forEach(async (element) => {
        let videoID = element.getElementsByTagName("a")[1].href.split("=")[1];
        let dateElement = element.getElementsByClassName(
          "yt-core-attributed-string"
        )[3];
        if (
          dateElement.innerText.includes("year") &&
          !dateElement.innerText.includes(".")
        ) {
          let timeDifference = await returnTimeDifference(videoID);
          dateElement.innerText = `${
            timeDifference === "1.0"
              ? `1.0 year ago`
              : `${timeDifference} years ago`
          }`;
        }
      });
    } catch (error) {}
  }
}
async function focusedVideo() {
  try {
    if (window.location.href.startsWith("https://www.youtube.com/watch")) {
      let videoID = window.location.href.toString().split("?v=")[1];
      let dateElement = document.getElementsByClassName(
        "style-scope yt-formatted-string bold"
      );
      let timeDifference = await returnTimeDifference(videoID);
      if (
        dateElement[2].innerText.includes("year") &&
        !dateElement[2].innerText.includes(".")
      ) {
        dateElement[2].innerText = `${
          timeDifference === "1.0"
            ? `1.0 year ago`
            : `${timeDifference} years ago`
        }`;
      }
    }
  } catch (error) {}
}
