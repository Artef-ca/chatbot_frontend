// import "https://unpkg.com/showdown/dist/showdown.min.js"
// var showdown= require('showdown')
window.haptikInitSettings = {
  "business-id": "3251",
  "client-id": "788c51ae2374eb343e72a9bf7ed11c20bebacecd",
  "base-url": "https://api.haptikapi.com/",
  "ignore-storage": "true",
};

window.haptikInitSettings = {
  "business-id": "3251",
  "client-id": "788c51ae2374eb343e72a9bf7ed11c20bebacecd",
  "base-url": "https://api.haptikapi.com/",
  "ignore-storage": "true",
};

let isInit = false;
let STATIC = "/static/";
function highlight(id) {
  console.log("test");
  let items = ["ls", "lr", "o"];
  items.forEach((item) => {
    if (item == id) {
      document.getElementById(item).children[1].classList.add("highlight");
    }
  });
}
function unHighlight(id) {
  let items = ["ls", "lr", "o"];
  items.forEach((item) => {
    if (item == id) {
      document.getElementById(item).children[1].classList.remove("highlight");
    }
  });
}
function showPopup(id) {
  console.log(id);
  document.getElementById(id).classList.remove("hide");
  if (id != "acceleratorPopup") {
    document.getElementById("accTrigger").classList.add("disabled");
  }
  document.body.classList.add("stopscroll");
  // setTimeout(()=>{
  //     document.getElementById(id).classList.add("hide");

  // },500)
}
function hidePopup(id) {
  document.getElementById(id).classList.add("hide");
  if (id != "acceleratorPopup") {
    document.getElementById("accTrigger").classList.remove("disabled");
  }
}
function init() {
  if (!isInit) {
    // addMessage("Hello! How can I assist you today?", "bot");
  }
  isInit = true;
}
function showStuff(id, text) {
  document.getElementById(id).style.display = "block";
  // hide the lorem ipsum text
  document.getElementById(text).style.display = "none";
  document.getElementById("headerText").style.display = "none";
  // hide the link
  // btn.style.display = 'none';

  document.getElementById("logoHeader").classList.add("chatStarted");
  document.getElementById("formHeader").classList.add("lessMargin");
  document.getElementById("headerImg").classList.add("header-in-chat");
  document.getElementById("chatHeader").classList.remove("hide");
  document.getElementById("formHeader").classList.add("hide");
}
function hideStuff(id, text) {
  document.getElementById(id).style.display = "none";
  // hide the lorem ipsum text
  document.getElementById(text).style.display = "flex";
  document.getElementById("headerText").style.display = "block";
  // hide the link
  // btn.style.display = 'none';

  document.getElementById("logoHeader").classList.remove("chatStarted");
  document.getElementById("formHeader").classList.remove("lessMargin");
  document.getElementById("headerImg").classList.remove("header-in-chat");
  document.getElementById("chatHeader").classList.add("hide");
  document.getElementById("formHeader").classList.remove("hide");

  const messagesDiv = document.querySelector(".messages");
  // botMessageDiv.innerHTML = `<b>Daniel DIFC:</b> ${bulletFormattedResponse}`;
  messagesDiv.innerHTML = "";
}

function openForm() {
  document.getElementById("myForm").style.display = "block";
  document.body.classList.add("stopscroll");
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
  document.body.classList.remove("stopscroll");
}

function sendMessage() {
  const userInput = document.getElementById("userInput").value;
  //   const messagesDiv = document.querySelector(".messages");

  if (userInput.trim() !== "") {
    // Append the user's message
    addMessage(userInput, "user", "");

    // Fetch the bot response from Django
    let rand = Math.random() * 10000 + 1;
    addMessage("", "bot", rand);
    fetch(`/chatbot_response/?message=${encodeURIComponent(userInput)}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.response);
        const response = data.response;
        // Convert newline characters to <br> tags for HTML display
        const formattedResponse = response.replace(
          /\\n|\\r\\n|\\n\\r|\\r/g,
          "<br />"
        );
        console.log(formattedResponse);

        // Convert bullet points: assuming '-' is used for bullet points in bot response
        // The following replaces '- ' with HTML bullet points.
        // Note: This is just a simple example. You might need to adjust based on the actual response format.
        const bulletFormattedResponse = formattedResponse
          .replace(/- /g, "<li>")
          .replace(/<br>/g, "</li><br>");

        addMessage(formattedResponse, "bot", rand);
      });

    // Clear the input field
    document.getElementById("userInput").value = "";
  }
}

function openChatbot() {
  var chatbotWindow = document.getElementById("chatbot-window");
  var chatbotButton = document.getElementById("chatbot-button");
  var buttonRect = chatbotButton.getBoundingClientRect();
  chatbotWindow.style.left = buttonRect.left + "px";
  chatbotWindow.style.top = buttonRect.top + "px";
  chatbotWindow.style.display = "block";
  chatbotButton.style.display = "none";
}
function selectAgent(type) {
  isInit = true;
  message = "";
  fetch(`/setAgentType/?type=${type}`)
    .then((response) => response.json())
    .then((data) => {
      message = data.message;
      showStuff("messages", "examples");
      let rand = Math.random() * 10000 + 1;
      addMessage("", "bot", rand);
      addMessage(message, "bot", rand);
    });
}
function addMessage(message, type, id) {
  const messagesDiv = document.querySelector(".messages");
  const botMessageDiv = document.createElement("div");
  // botMessageDiv.innerHTML = `<b>Daniel DIFC:</b> ${bulletFormattedResponse}`;
  if (type == "user") {
    botMessageDiv.innerHTML = `<div class="message userMessage">
    <button>
        <img src="${STATIC}userChat.svg"></button>
        <div class='chatText'> ${message}</div>
        `;
  } else {
    if (message != "") {
      var converter = new showdown.Converter(),
        // htmlContent.innerHTML=converter.makeHtml(text);
        text = `<div class="message">
      <button>

      <img src="${STATIC}hiwarChat.svg"></button>
      <div class='chatText' style="white-space:revert;">${converter.makeHtml(
        message
      )}</div>
      </div>`;
      console.log(converter.makeMarkdown(message));
      console.log(message);
      document.getElementById(id).innerHTML = text;
    } else {
      botMessageDiv.setAttribute("id", id);
      botMessageDiv.innerHTML = `<div class="message">
      <button>
      <img src="${STATIC}hiwarChat.svg"></button>
      <div class='chatText' style="white-space:revert;"><div class="loading">
      <span class="loading__dot"></span>
      <span class="loading__dot"></span>
      <span class="loading__dot"></span>
    </div></div>
      </div>`;
    }
  }
  // botMessageDiv.classList.add("message");
  messagesDiv.appendChild(botMessageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
function submitOnEnter(event) {
  if (event.which === 13) {
    if (!event.repeat) {
      const newEvent = new Event("submit", { cancelable: true });
      event.target.form.dispatchEvent(newEvent);
    }

    event.preventDefault(); // Prevents the addition of a new line in the text field
    showStuff("messages", "examples");
    init();
  }
}
function resetBot() {
  fetch(`/setAgentType/?type=default`).then((response) => response.json());

  fetch(`/bot_reset/?x=x`).then((response) => response.json());
  hideStuff("messages", "examples");
}

window.addEventListener("load", function () {
  if (navigator.userAgent.indexOf("iPhone") > -1) {
    document
      .querySelector("[name=viewport]")
      .setAttribute(
        "content",
        "width=device-width, initial-scale=1, maximum-scale=1"
      );
  }
  document
    .getElementById("userInput")
    .addEventListener("keydown", submitOnEnter);

  fetch(`/create_bot/?x=x`).then((response) => response.json());

  var e = document.createElement("base");
  e.target = "_blank";
  document.head.appendChild(e);
  if (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  ) {
    console.log("test");
  } else {
  }
});
