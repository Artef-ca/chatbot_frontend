<script lang="ts" context="module">
  import { get, writable } from "svelte/store";
  import type { MessageContents, MessageResponse } from "./lib/types";
  import {
    agent_writable,
    messageLogWritable,
    newApiRequest,
  } from "./Functions.svelte";

  export let started_writable = writable(false);
  export let thinking_writable = writable(false);
  export let question_asked_writable = writable(false);
  export let segments_writable = writable([]);
  export let audienceType_writable = writable("Unidentified");
  export let audienceSegment_writable = writable("");
  export let withSegment_writable = writable(false);
  export let prompt_id_writable = writable("default");
  export let report_id_writable = writable("default");
  let messageLog: MessageContents[] = [];
  messageLogWritable.subscribe((data) => {
    console.log(data);
    messageLog = data;
  });
  let promptId: string;
  prompt_id_writable.subscribe((data) => {
    promptId = data;
  });
  let reportId: string;
  report_id_writable.subscribe((data) => {
    reportId = data;
  });
  let audienceType: string;
  audienceType_writable.subscribe((data) => {
    audienceType = data;
  });
  let audienceSegment: string;
  audienceSegment_writable.subscribe((data) => {
    audienceSegment = data;
  });
  let withSegment: string;
  withSegment_writable.subscribe((data) => {
    withSegment = data;
  });
  let thinking;
  thinking_writable.subscribe((data) => {
    console.log(data);
    thinking = data;
  });
  let question_asked;
  question_asked_writable.subscribe((data) => {
    console.log(data);
    question_asked = data;
  });
  let agent: string;
  agent_writable.subscribe((data) => {
    agent = data;
  });

  export function addMessage(
    msg: MessageResponse,
    typee: string
  ): MessageResponse {
    let start;
    started_writable.subscribe((data) => {
      start = data;
    });
    console.log(msg.state, start);
    if (msg.state && start) {
      console.log(msg);
      setMessageLog([...messageLog, { type: typee, ...msg.data }]);
      // messageLog = ;
    }
    scrollToBottom();

    return msg;
  }
  export function startAudience(question: string) {
    started_writable.set(true);
    initAudience(question);
  }
  function scrollToBottom() {
    // Delay for 100ms to allow the DOM to update
    setTimeout(() => {
      const element = document.getElementById("chatWindow");
      if (element) element.scrollTop = element.scrollHeight;
    }, 100);
  }

  function initAudience(
    question: string,
    selection: any[] = ["Identified", "Unidentified"]
  ) {
    // clearMessages();
    console.log("HERE");
    thinking = true;
    // addMessage(
    //   {
    //     data: {
    //       // type: "user_question",
    //       dataframe: "",
    //       fig: "",
    //       message_id: "",
    //       question: "",
    //       response: question,
    //       sql_query: "",
    //       buttons: selection,
    //     },
    //     state: true,
    //   },
    //   "audience_bot_msg"
    // );
    let q = "Hello! I would like to explore my audiences!";
    let message = {
      data: {
        type: "user_question",
        dataframe: "",
        fig: "",
        message_id: "",
        question: q,
        response: q,
        sql_query: "",
      },
      state: true,
    };

    newQuestion(q, "user");
    newApiRequest(
      "get_report_info",
      "POST",
      {
        report_id:
          reportId.toLowerCase() == "default"
            ? "Default" + " " + audienceType
            : reportId,
      },
      "audience"
    ).then((data) => {
      prompt_id_writable.set(data.data.prompt_id);
    });

    question_asked = true;
  }

  export function newQuestion(question: string, type: any) {
    // clearMessages();
    console.log("HERE");
    thinking_writable.set(true);
    addMessage(
      {
        data: {
          type: "user_question",
          question: question,
        },
        state: true,
      },
      ""
    );
    question_asked_writable.set(true);

    newApiRequest(
      "chat",
      "POST",
      {
        user_input: question,
        user_id: localStorage.getItem("user_email"),
        prompt_id: promptId,
        report_id:
          reportId.toLowerCase() == "default"
            ? "Default" + " " + audienceType
            : reportId,
        audience_type: audienceType,
      },
      agent == "insights" ? "insights" : "audience"
    ).then((msg: MessageResponse) => {
      console.log("MSG:", msg);
      if (msg.data.with_segment && msg.data.with_segment == true) {
        withSegment_writable.set(true);
      }
      addMessage(
        msg,
        agent == "insights"
          ? "success"
          : msg.data.report != null
            ? "audience"
            : (msg.data.segment_buttons != null &&
                  msg.data.segment_buttons.length > 0) ||
                (msg.data.type_buttons != null &&
                  msg.data.type_buttons.length > 0)
              ? "audience_bot_msg"
              : "audience"
        // : (msg.data.segment_buttons != null && msg.data.segment_buttons.length > 0) ||
        //     (msg.data.type_buttons != null && msg.data.type_buttons.length > 0)
        //   ? "audience_bot_msg"
        //   : "audience"
      );
      thinking_writable.set(false);
      if (agent == "audience") {
        if (
          msg.data.segment_buttons != null &&
          msg.data.segment_buttons.length > 0
          // msg.data.response.includes("segment")
        ) {
          segments_writable.set(msg.data.segment_buttons);
        }
        // else{
        //   segments_writable.set([]);
        // }
      }
    });
  }

  export function setMessageLog(data: MessageContents[]) {
    messageLogWritable.set(data);
  }
</script>
