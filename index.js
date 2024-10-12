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
  let reqData = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoID}&key=`
  );
  let json = await reqData.json();
  let publishedDate = new Date(json.items[0].snippet.publishedAt).getTime();
  return ((new Date().getTime() - publishedDate) / 86400000 / 365).toFixed(1);
}
async function homeVideos(videoCollection) {
  let videoArray = Array.from(videoCollection);

  videoArray.forEach(async (element) => {
    try {
      let videoID = element.getElementsByTagName("a")[1].href.split("=")[1];
      let dateElement = element.getElementsByClassName(
        "inline-metadata-item style-scope ytd-video-meta-block"
      )[1];
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
    } catch (error) {
      console.log(error);
    }
  });
}
async function focusedVideo() {
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
}
