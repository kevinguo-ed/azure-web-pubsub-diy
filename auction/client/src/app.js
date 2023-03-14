import { WebPubSubClient } from "@azure/web-pubsub-client";

const bidButton = document.querySelector("#btn-bid");
const currentBid = document.querySelector("#bid-current");
const newBidButton = document.querySelector("#btn-place_bid");
// Overlay elements
const bidOverlay = document.querySelector("#overlay-place_bid");
const closeOverlayButton = document.querySelector("#btn-close_bid_overlay");

async function connect() {
  const client = new WebPubSubClient({
    getClientAccessUrl: async () => (await fetch("/negotiate")).text(),
  });

  client.on("server-message", (e) => {
    setCurrentBid(e.message.data.currentBid);
  });

  await client.start();
}

connect();

bidButton.addEventListener("click", () => {
  bidOverlay.classList.toggle("hidden");
});

newBidButton.addEventListener("click", () => {
  let value = document.getElementById("new-bid").value;
  let body = JSON.stringify({ bid: value });
  console.log(body);
  fetch(`/bid?bid=${value}`, { method: "POST" })
    .then((response) => {
      if (response.status !== 200) {
        console.log(
          "Looks like there was a problem. Status Code: " + response.status
        );
        return;
      }
      bidOverlay.classList.toggle("hidden");
      return response.text();
    })
    .then((text) => {
      setCurrentBid(text);
    })
    .catch((e) => {
      document.getElementById("error").innerText = e;
    });
});

closeOverlayButton.addEventListener("click", () => {
  bidOverlay.classList.toggle("hidden");
});

function setCurrentBid(value) {
  currentBid.innerText = format(value);
}

function format(value) {
  const val = parseInt(value);
  return val.toLocaleString("en-us", { minimumFractionDigits: 0 });
}

fetch("/currentBid")
  .then((res) => res.text())
  .then((text) => setCurrentBid(text));
