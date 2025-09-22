<script lang="ts" context="module">
  import { get, writable } from "svelte/store";
  import type { Agent, MessageContents, MessageResponse } from "./lib/types";
  import type { Method } from "axios";
  // let apiUrl = import.meta.env.VITE_API_URL;
  // let apiUrl: any
  let apiUrl: any;
  let audienceApiUrl: any;
  let myToken: any = null;
  export const envReady = writable(false);

  // Fetch runtime environment variables
  fetch("./env.js")
    .then((res) => {
      if (!res.ok) {
        throw new Error(
          `Failed to load environment variables: ${res.statusText}`
        );
      }
      return res.text();
    })
    .then((text) => {
      console.log("ENV", text);
      const env = eval(text); // Evaluate the script to access window.env
      apiUrl = env.VITE_API_URL;
      audienceApiUrl = env.VITE_AUDIENCE_API_URL;
      myToken = env.VITE_MY_TOKEN;
      console.log("Runtime API URL:", apiUrl);
      envReady.set(true);
            localStorage.setItem("user_email", 'test@email.com');

    })
    .catch((err) => console.error(err));

  //   let email
  let adding: boolean;
  export let messageLogWritable = writable<MessageContents[]>();
  let messageLog: MessageContents[] = [];
  messageLogWritable.subscribe((data) => {
    console.log(data);
    messageLog = data;
  });

  export function setMessageLog(data: MessageContents[]) {
    messageLogWritable.set(data);
    console.log(messageLog);
  }

  export let abortController = new AbortController();

  export let reportIssueSet = writable({
    enabled: false,
    img: "",
    thumbnail: "",
  });

  //   export let showFavoriteModal: boolean = false;
  export let email = writable();
  export let agent_writable = writable("insights");

  export let clickedElement = writable();
  export let showFavoriteModal = writable({
    enabled: false,
  });
  export let showThumbsModal = writable({
    enabled: false,
    isDown: null,
  });
  export let showPromptModal = writable({
    enabled: false,
  });
  export let showNewPromptModal = writable({
    enabled: false,
  });
  export let showLoader = writable({
    enabled: false,
  });
  export let showAddFavoriteModal = writable({
    enabled: false,
  });
  export let isadding = writable({
    enabled: false,
  });

  isadding.subscribe((data) => {
    adding = data.enabled;
  });
  export let emailSet = writable({
    enabled: false,
  });
  export let passwordSet = writable({
    enabled: false,
  });

  export let currentReport: any = writable([]);
  if (localStorage.getItem("user_email") != null) {
    email.set(localStorage.getItem("user_email"));
  } else {
    emailSet.set({
      enabled: true,
    });
  }
  export function setEmailValue(value: string | null) {
    email.set(value);
  }
  export let favoriteMessage = writable<MessageContents | null>();
  export let thumbsMessage = writable<MessageContents | null>();

  export let favorites: any = [];

  export function checkFavorites() {
    getAllFavorites().then((data) => {
      favorites = data.data;
    });
  }

  export function setFavoriteModal(state: boolean, message: MessageContents) {
    showFavoriteModal.set({
      enabled: state,
    });
    console.log(message);
    if (message == null) {
      favoriteMessage.set(null);
    } else {
      favoriteMessage.set(message);
    }
  }
  export function setThumbsModal(
    state: boolean,
    message: MessageContents,
    isDown: any = null
  ) {
    showThumbsModal.set({
      enabled: state,
      isDown: isDown,
    });
    console.log(message);
    if (message == null) {
      thumbsMessage.set(null);
    } else {
      thumbsMessage.set(message);
    }
  }
  export function test() {
    console.log("TEST");
  }
  export function thumbsDown(feedback: string) {
    const data = get(thumbsMessage);
    if (data != null) {
      newApiRequest("feedback", "POST", {
        message_id: data.message_id,
        feedback_message: feedback,
      }).then((res: any) => {
        console.log(res);
        setThumbsModal(false, null, false);
      });
    }
  }

  export function addToFavorite(title: string) {
    favoriteMessage.subscribe((data: any) => {
      if (data != null) {
        console.log(title, data);
        const user_id: string = JSON.parse(localStorage.getItem("user_id")!);

        newApiRequest("add_favorites", "POST", {
          user_id: localStorage.getItem("user_email"),
          response_id: data.id,
          title: title,
        }).then((data: any) => {
          console.log(data);
        });
        let temp = {
          user_ID: user_id,
          title: title,
          data: data,
        };
        tempJson.push(temp);
        console.log(tempJson);
      }
    });
  }
  export function getAllFavorites() {
    return newApiRequest("get_favorites", "GET", {
      user_id: localStorage.getItem("user_email"),
    });
    // return tempJson;
  }
  export function setEmail(value: string, password: string) {
    // emailSet.set({ enabled: false });
    // email.set(value);
    // console.log(value,password)
    setTimeout(() => {
      //   newApiRequest("login", "GET", {
      //   user_email: value,
      //   user_password: password,
      // }).then((res: any) => {
      //   console.log('res: ',res);
      // if (res.data.success == true) {
      console.log("SUCCESS == TRUE");
      // localStorage.setItem("user_email", value);
      localStorage.setItem("user_email", 'test@email.com');
      // localStorage.setItem("user_email", value);
      emailSet.set({ enabled: false });
      email.set(value);

      // }
      // else if (res.data.success == false) {
      //   console.log("SUCCESS == FALSE");
      //   localStorage.clear();

      // }
      // window.location.href = window.location.href;
      // window.location.reload();
      // });
    }, 1000);
  }

  export function captureElement(element: any) {
    clickedElement.set(element);
    if (adding) {
      console.log("adding");
      showAddFavoriteModal.set({
        enabled: true,
      });
    }
  }
  let tempJson: any[] = [];
  export async function newApiRequest(
    endpoint: string,
    method: Method,
    args: Object,
    type: string = "insights"
  ): Promise<MessageResponse> {
    try {
      args = { ...args, user_id: localStorage.getItem("user_email") };
      abortController = new AbortController();

      let queryString: string = "";
      let response: Response;
      let headers: HeadersInit = {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      };

      // Add Authorization header if myToken is not null
      if (myToken) {
        headers = {
          ...headers,
          Authorization: `Bearer ${myToken}`,
        };
      }

      // Generate query string from props
      if (method === "GET") {
        queryString = Object.entries(args)
          .filter(([key, _]) => key !== "endpoint" && key !== "addMessage") // Exclude 'endpoint' from the query string
          .map(
            ([key, value]) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
          )
          .join("&");

        response = await fetch(
          `${type == "insights" ? apiUrl : audienceApiUrl}${endpoint}?${queryString}`,
          {
            signal: abortController.signal,
            headers,
          }
        );
      } else if(method === "POST") {
        let jsonArgs = JSON.stringify(args);
        response = await fetch(
          `${type == "insights" ? apiUrl : audienceApiUrl}${endpoint}`,
          {
            method: "POST",
            headers,
            signal: abortController.signal,
            body: jsonArgs,
          }
        );
      }
       else if(method === "DELETE") {
        queryString = Object.entries(args)
          .filter(([key, _]) => key !== "endpoint" && key !== "addMessage") // Exclude 'endpoint' from the query string
          .map(
            ([key, value]) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
          )
          .join("&");

        response = await fetch(
          `${type == "insights" ? apiUrl : audienceApiUrl}${endpoint}?${queryString}`,
          {
            method:"DELETE",
            signal: abortController.signal,
            headers,
          }
        );
      }

      if (!response.ok) {
        throw new Error(
          "The server returned an error. See the server logs for more details."
        );
      }

      // If this is a download endpoint (expecting a Blob), handle it
      if (endpoint == "download_report") {
        const blob = await response.blob(); // Get the response as a Blob (binary data)
        const downloadUrl = window.URL.createObjectURL(blob); // Create a temporary URL for the Blob
        const a = document.createElement("a"); // Create an <a> element to trigger the download
        a.href = downloadUrl;
        console.log(blob);
        a.download = endpoint.split("/").pop() || "download.pdf"; // Set a default file name
        a.click(); // Simulate a click event to trigger the download
        window.URL.revokeObjectURL(downloadUrl); // Clean up the object URL after download
        return {
          data: { type: "success", message: "Download started." },
          state: true,
        };
      }

      // If it's not a binary response, return JSON as usual
      const data: MessageContents = await response.json();
      return { data: data, state: true };
    } catch (error) {
      return { data: { type: "error", error: String(error) }, state: true };
    }
  }

  export function addNewIssue(screenshot: string, issue: string) {
    return newApiRequest("report", "POST", {
      screenshot: screenshot,
      // message_log: messageLog,
      issue_message: issue,
    });
  }
  export function stopAnswer(id: string) {
    return newApiRequest("stop_answer", "POST", {
      id: id,
    });
  }
</script>
