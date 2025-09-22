<script lang="ts" context="module">
  import { writable } from "svelte/store";
  import type { Agent, MessageContents, MessageResponse } from "./lib/types";
  import type { Method } from "axios";

  let model: Agent = {
    type: "gpt",
    message: "",
    title: "GPT-4",
    img: "",
    intro: "",
  };
  let adding: boolean;
  const abortController = new AbortController();
  export let feedback = writable();
  export let feedbackSet = writable({
    enabled: false,
  });

  export function setFeedback(value: string) {
    // localStorage.setItem("user_email", value);
    feedback.set(value);
  }



  async function newApiRequest(
    endpoint: string,
    method: Method,
    args: Object
  ): Promise<MessageResponse> {
    try {
      // apiStatus = { status: 'Loading' };
      //   thinking = true;

      let queryString: string = "";
      let response: Response;

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
          `/api/v0/${endpoint}?${queryString}&model=${model.type}`,
          {
            signal: abortController.signal,
          }
        );
        console.log(response);
      } else {
        let jsonArgs = JSON.stringify(args);

        response = await fetch(`/api/v0/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          signal: abortController.signal,
          body: jsonArgs,
        });
      }

      if (!response.ok) {
        throw new Error(
          "The server returned an error. See the server logs for more details."
        );
      }
      const data: MessageContents = await response.json();
      console.log(data);

      return { data: data, state: true };
    } catch (error) {
      // apiStatus = { status: 'Error', error: "Put the error here" };

      return { data: { type: "error", error: String(error) }, state: false };
    }
  }
</script>
