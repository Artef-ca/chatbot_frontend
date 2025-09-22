<script lang="ts">
  import TailwindCss from "../lib/TailwindCSS.svelte"; // This is necessary for tailwind to work
  import Sidebar from "../lib/Sidebar.svelte";
  import "preline";
  import { onMount } from "svelte";

  import type {
    Agent,
    MessageContents,
    MessageResponse,
    Method,
    Page,
    QuestionLink,
  } from "../lib/types.ts";

  import ChatPage from "../lib/ChatPage.svelte";
  import TrainingData from "../lib/TrainingData.svelte";
  import FavoriteModal from "../lib/FavoriteModal.svelte";
  import {
    abortController,
    agent_writable,
    email,
    messageLogWritable,
    newApiRequest,
    reportIssueSet,
    setMessageLog,
    stopAnswer,
  } from "../Functions.svelte";
  import UserModal from "../lib/UserModal.svelte";
  import AddFavoriteModal from "../lib/AddFavoriteModal.svelte";
  import FeedbackModal from "../lib/FeedbackModal.svelte";
  import ReportIssueModal from "../lib/ReportIssueModal.svelte";
  import ReportGeneratorPage from "../lib/ReportBuilder/ReportGeneratorPage.svelte";
  import { generatePDFAll } from "../PdfGen.svelte";
  import Loader from "../lib/Loader.svelte";
  import ThumbsDownModal from "../lib/thumbsDownModal.svelte";
  import {
    question_asked_writable,
    started_writable,
    thinking_writable,
  } from "../chatFunctions.svelte";
  import PromptModal from "../lib/PromptModal.svelte";
  import NewPromptModal from "../lib/NewPromptModal.svelte";

  let message = "Loading...";
  let messageLog: MessageContents[] = [];
  setMessageLog([]);
  messageLogWritable.subscribe((data) => {
    messageLog = data;
  });
  onMount(async () => {
    // email.subscribe((data) => {
    //   newApiRequest("set_user_id", "POST", {
    //     user_id: localStorage.getItem("user_email"),
    //   })
    //     // .then(addMessage)
    //     .then((msg: any) => {
    //       console.log(msg);
    //       // addMessage(msg);
    //     });
    // });
    // if (localStorage.getItem("user_email") != null) {
    //   newApiRequest("set_user_id", "POST", {
    //     user_id: localStorage.getItem("user_email"),
    //   })
    //     // .then(addMessage)
    //     .then((msg: any) => {
    //       console.log(msg);
    //       // addMessage(msg);
    //     });
    // }

    // Check the URL to see what page we're on
    const url = new URL(window.location.href);
    const page = url.hash.slice(1);
    if (page === "training-data") {
      getTrainingData();
    } else if (page === "report-generator") {
      reportBuilderPage();
    } else {
      newQuestionPage();
    }

    started_writable.subscribe((data: any) => {
      started = data;
    });

    thinking_writable.subscribe((data) => {
      thinking = data;
    });
    question_asked_writable.subscribe((data) => {
      question_asked = data;
    });
    // getQuestionHistory();
  });
  // let abortController = new AbortController();

  let agents: Agent[] = [
    {
      type: "recommendation",
      message: "What is the total marketing spend in 2024?",
      message2: "What is the average CPC for campaigns in 2024?",
      message3: "What is the total conversions in 2024?",
      title: "New Discovery",
      img: "/legal.svg",
      intro:
        "Hello! I'm here to help you uncover insights from Conversational Chatbot data. You can ask me questions about the leasing performance data to uncover insights.",
    },
    // {
    //   type: "documents",
    //   message: "Generate a collections report for Ibn Battuta Mall.",
    //   title: "Report Generation",
    //   img: "business-report.svg",
    //   intro:
    //     "Hello! I'm here to help you generate reports for Nakheel Assets. You can currently ask me to generate reports for Asset Performance and Collections.",
    // },
    // {
    //   type: "office_space",
    //   message: "What is the policy on customer data privacy in Nakheel?",
    //   title: "Employee Assist",
    //   img: "employeeAssist.svg",
    //   intro:
    //     "Hello! I'm here to help check policies, procedures and guidelines for Nakheel Assets. This agent is a work in progress and will be available soon.",
    // },
  ];
  let models: {
    type: string;
    message: string;
    title: string;
    img: string;
    intro: string;
  }[] = [
    {
      type: "gpt",
      message: "",
      title: "GPT-4",
      img: "/legal.svg",
      intro: "",
    },
    {
      type: "gemini",
      message: "",
      title: "Gemini Pro",
      img: "business-report.svg",
      intro: "",
    },
    {
      type: "mistral",
      message: "",
      title: "Mistral",
      img: "employeeAssist.svg",
      intro: "",
    },
  ];

  let suggestedQuestions: MessageContents | null = null;
  let trainingData: MessageContents | null = null;
  let question_asked = false;
  let thinking = false;
  let marked_correct: boolean | null = null;
  let agent: Agent;
  let model: Agent = {
    type: "gpt",
    message: "",
    title: "GPT-4",
    img: "",
    intro: "",
  };

  let currentPage: Page;
  let sidebarToggled: boolean = false;
  let started: boolean = false;

  let questionHistory: QuestionLink[] = [];
  $: sidebarToggled, console.log(sidebarToggled);

  let selectedAgent: any;
  agent_writable.subscribe((data) => {
    selectedAgent = data;
  });

  function toggle() {
    sidebarToggled = !sidebarToggled;
  }

  function reset() {
    // started = false;
    newQuestionPage();
    // clearMessages()
  }
  function editMessage(i: number, message: string) {
    let id = messageLog[i + 1].id;
    console.log(id);
    messageLog[i].question = message;
    messageLog.splice(i + 1, messageLog.length - 1);
    newApiRequest("chat", "POST", { user_input: message },selectedAgent=='insights'?'insights':'audience')
      // .then(addMessage)
      .then((msg: MessageResponse) => {
        console.log(msg);
        addMessage(msg,selectedAgent=='insights'?'success':'audience');
      });
  }
  function clearMessages() {
    // messageLog = [];
    question_asked_writable.set(false);
    thinking_writable.set(false);
    marked_correct = null;
  }
  function containsAny(str: string, substrings: string[]) {
    for (var i = 0; i != substrings.length; i++) {
      var substring = substrings[i];
      if (str.toLowerCase().indexOf(substring) != -1) {
        return substring;
      }
    }
    return null;
  }

  function newQuestion(question: string) {
    // clearMessages();
    console.log("HERE");
    thinking_writable.set(true);
    addMessage({
      data: {
        type: "user_question",
        question: question,
      },
      state: true,
    });
    question_asked_writable.set(true);

    newApiRequest( "chat" , "POST", {
      user_input: question,
      user_id: localStorage.getItem("user_email"),  
      
    },selectedAgent=='insights'?'insights':'audience').then((msg: MessageResponse) => {
      console.log("MSG:", msg);
      addMessage(msg,selectedAgent == "insights"
          ? "success"
          : msg.data.buttons != null && msg.data.buttons.length > 0
            ? "audience_bot_msg"
            : "audience"
      );
      thinking_writable.set(false);
    });
  }
  function generateFollowUpQuestions(msg: any) {
    console.log(msg);
    // messageLog.pop()
    newApiRequest("generate_followup_questions", "GET", {
      id: msg.id,
    }).then(addMessage);
  }
  function generateChart(msg: any) {
    console.log(msg);
    // messageLog.pop()
    newApiRequest("plot", "POST", {
      data: msg.dataframe,
      question: msg.question,
    }).then((data) => {
      if(data.data.fig != "")
      addMessage(data);
    });
  }
  function generateSummary(msg: any) {
    console.log(msg);
    newApiRequest("generate_summary", "GET", {
      question: msg.question,
      id: msg.id,
      df: msg.df,
    }).then(addMessage);
  }

  function rerunSql(id: string) {
    let df: any;
    let sql: any;

    addMessage({
      data: {
        type: "user_question",
        question: "Re-run the question",
      },
      state: true,
    });
    let newMsg: any;
    newApiRequest("run_sql", "GET", { id: id })
      // .then(addMessage)
      .then((msg: MessageResponse) => {
        // sql = msg.data;
        df = msg.data;
        newMsg = msg;
        newMsg.data.text = "";
        // addMessage(msg);
        return newMsg;
      })
      .then((msg: MessageResponse) => {
        if (msg.data.type === "df") {
          newApiRequest("generate_plotly_figure", "GET", {
            id: msg.data.id,
          }).then((msg: MessageResponse) => {
            if (msg.data.type === "plotly_figure") {
              // questionHistory = [...questionHistory, { question, id: msgId }];
              console.log(msg);
              newMsg.data.fig = msg.data.fig;
              newMsg.data.type = "plotly_figure";
              console.log("NEW", newMsg);

              addMessage(newMsg);
              return newMsg;
            }
          });
        }
      });
  }

  function getQuestionHistory() {
    newApiRequest("chat_history", "POST", {
      user_id: localStorage.getItem("user_email"),
    }).then((data) => {
      console.log("res", data);
      setQuestionHistory(data.data);
    });
  }

  function getTrainingData() {
    window.location.hash = "training-data";
    currentPage = "training-data";

    newApiRequest("get_training_data", "GET", []).then(setTrainingData);
  }

  function newQuestionPage() {
    agent = { type: "", message: "", title: "", img: "", intro: "" };
    window.location.hash = "";
    currentPage = "chat";
    // setMessageLog([]);
    // messageLog = [];
    // started = false;
    abortController.abort;
    // clearMessages();
  }
  function reportBuilderPage() {
    // agent = { type: "", message: "", title: "", img: "", intro: "" };
    window.location.hash = "report-builder";
    currentPage = "report-builder";
    // messageLog = [];
    // started = false;
    abortController.abort;
    // clearMessages();
  }
  function abort() {
    console.log("aborting");
    abortController.abort();
    console.log(messageLog[messageLog.length - 1]);
    stopAnswer(messageLog[messageLog.length - 1].id).then((data) => {
      console.log(data);
    });
  }

  function loadQuestionPage(q: any) {
    window.location.hash = q.message_id;
    currentPage = "chat";
    // messageLog = [];
    // clearMessages();
    question_asked_writable.set(true);
    started_writable.set(true);
    // started = true;

    let msg: MessageResponse = {
      data: {
        type: "user_question",
        question: q.question,
      },
      state: true,
    };
    addMessage(msg);
    let temp: MessageResponse = {
      data: {
        type: "question_cache",
        ...q,
      },
      state: true,
    };
    console.log("tempp", temp);
    // temp.setAttribute('type','question_cache')
    addMessage(temp);
    // newApiRequest("load_question", "GET", {
    //   id: q.id,
    //   question: q.question,
    // }).then((data) => {
    //   console.log("res", data);
    //   addMessage(data);
    // });
  }

  function removeTrainingData(id: string) {
    trainingData = null;
    newApiRequest("remove_training_data", "POST", { id: id }).then(
      (msg: MessageResponse) => {
        newApiRequest("get_training_data", "GET", []).then(setTrainingData);
      }
    );
  }

  function addMessage(
    msg: MessageResponse,
    typee: string = "success"
  ): MessageResponse {
    console.log(msg.state, started);
    if (msg.state && started) {
      console.log(msg);
      setMessageLog([...messageLog, { type: typee, ...msg.data }]);
      // messageLog = ;
    }
    scrollToBottom();
    return msg;
  }

  function setTrainingData(data: MessageResponse): MessageResponse {
    trainingData = data.data;
    return data;
  }

  function setSuggestedQuestions(data: MessageContents): MessageContents {
    suggestedQuestions = data;
    return data;
  }

  function setQuestionHistory(data: any): MessageContents {
    // if (data.type === "question_history") {
    questionHistory = data;
    // }

    return data;
  }

  function onTrain(trainingDataContents: string, trainingDataType: string) {
    trainingData = null;
    let args: { [key: string]: string } = {};
    args[trainingDataType] = trainingDataContents;
    newApiRequest("train", "POST", args)
      .then(setTrainingData)
      .then((msg: MessageResponse) => {
        if (msg.data.type !== "error") {
          newApiRequest("get_training_data", "GET", []).then(setTrainingData);
        }
      });
  }

  // export async function newApiRequest(
  //   endpoint: string,
  //   method: Method,
  //   args: Object
  // ): Promise<MessageResponse> {
  //   // checkFavorites();
  //   abortController = new AbortController();
  //   const status = started;
  //   try {
  //     // apiStatus = { status: 'Loading' };
  //     // thinking = true;

  //     let queryString: string = "";
  //     let response: Response;

  //     // Generate query string from props
  //     if (method === "GET") {
  //       queryString = Object.entries(args)
  //         .filter(([key, _]) => key !== "endpoint" && key !== "addMessage") // Exclude 'endpoint' from the query string
  //         .map(
  //           ([key, value]) =>
  //             `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
  //         )
  //         .join("&");

  //       response = await fetch(
  //         `/api/v0/${endpoint}?${queryString}&model=${model.type}`,
  //         {
  //           signal: abortController.signal,
  //         }
  //       );
  //       console.log(response);
  //     } else {
  //       let jsonArgs = JSON.stringify(args);

  //       response = await fetch(`/api/v0/${endpoint}`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         signal: abortController.signal,
  //         body: jsonArgs,
  //       });
  //     }

  //     if (!response.ok) {
  //       throw new Error(
  //         "The server returned an error. See the server logs for more details."
  //       );
  //     }
  //     const data: MessageContents = await response.json();
  //     console.log(data);

  //     // thinking = false;

  //     return { data: data, state: status };
  //   } catch (error) {
  //     // apiStatus = { status: 'Error', error: "Put the error here" };
  //     // thinking = false;

  //     return { data: { type: "error", error: String(error) }, state: status };
  //   }
  // }

  function scrollToBottom() {
    // Delay for 100ms to allow the DOM to update
    setTimeout(() => {
      const element = document.getElementById("chatWindow");
      if (element) element.scrollTop = element.scrollHeight;
    }, 100);
  }

  function findQuestionSql() {
    let question = messageLog.find((msg) => msg.type === "user_question");
    if (question && question.type === "user_question") {
      let sql = messageLog.find((msg) => msg.type === "sql");
      if (sql && sql.type === "sql") {
        return { question: question.question, sql: sql.text };
      }
    }
    return null;
  }

  function onUpdateSql(sql: string) {
    let question = messageLog.find((msg) => msg.type === "user_question");
    if (question && question.type === "user_question") {
      let questionSql = { question: question.question, sql: sql };

      newApiRequest("train", "POST", questionSql);

      // Remove the user's SQL from the message log
      setMessageLog(messageLog.filter((msg) => msg.type !== "user_sql"));
      // messageLog = messageLog.filter((msg) => msg.type !== "user_sql");

      // Add the user's SQL to the message log
      addMessage({
        data: { type: "sql", text: sql, id: window.location.hash },
        state: true,
      });
    }
  }

  $: {
    if (marked_correct === true) {
      let questionSql = findQuestionSql();
      if (questionSql) {
        newApiRequest("train", "POST", questionSql);
      }
    } else if (marked_correct === false) {
      addMessage({ data: { type: "user_sql" }, state: true });
    }
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="/style/dark.css" />
</svelte:head>

<main>
  <div class="form">
    <div class="formInner">
      <Sidebar
        {getTrainingData}
        {newQuestionPage}
        {reportBuilderPage}
        {loadQuestionPage}
        bind:agent
        bind:model
        {questionHistory}
        bind:sidebarToggled
        {agents}
        {models}
        bind:started
        {messageLog}
        bind:question_asked
      />
      <div
        style=" padding-left:{!sidebarToggled ? '16.5rem' : '0rem'}"
        class="transition-all duration-300"
      >
        <div
          style="padding: 0.5rem; 
                 display: flex;
                 align-items: center;
                 justify-content: space-between;
                "
        >
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <svg
            on:click={toggle}
            class="w-7 h-7"
            width="16"
            height="16"
            fill="white"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
            />
          </svg>
          <div style="display: flex; flex-direction:column; align-items:center">
            {#if agent.intro != ""}
              <!-- <div style="color: var(--text-color); font-weight:100">
                <span style="color: var(--text-color); font-weight:400"
                  >Hiwar:
                </span>
                {agent.title}
              </div> -->
            {/if}
            <!-- {#if model.title != ""}
              <div
                style="color: white; font-weight:100; display: flex;
            align-items: center;"
              >
                <span
                  style="color: white; font-weight:400; margin-right:0.5rem;"
                  >{model.title}
                </span><span class="selected"></span>
              </div>
            {/if} -->
          </div>
          <div style="display: flex;">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <svg
              on:click={() => {
                generatePDFAll(0.3).then(function (canvas) {
                  const imgThumbnail = canvas.toDataURL("image/png", 0.4);
                  console.log(imgThumbnail);

                  generatePDFAll(0.1).then(function (canvas) {
                    const imgData = canvas.toDataURL("image/png", 0.1);
                    console.log(imgData);

                    reportIssueSet.set({
                      enabled: true,
                      img: imgData,
                      thumbnail: imgThumbnail,
                    });
                  });
                });
              }}
              class="w-7 h-7"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 2H8C4.691 2 2 4.691 2 8v13a1 1 0 0 0 1 1h13c3.309 0 6-2.691 6-6V8c0-3.309-2.691-6-6-6zm-3 16h-2v-2h2v2zm0-4h-2V6h2v8z"
                fill="white"
              />
            </svg>

            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <svg
              on:click={reset}
              class="w-7 h-7"
              width="16"
              height="15"
              viewBox="0 0 16 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.99998 1.875C7.99998 1.875 3.87598 5.2125 1.57131 7.02C1.43598 7.135 1.33331 7.3025 1.33331 7.5C1.33331 7.84562 1.63131 8.125 1.99998 8.125H3.33331V12.5C3.33331 12.8456 3.63131 13.125 3.99998 13.125H5.99998C6.36865 13.125 6.66665 12.845 6.66665 12.5V10H9.33331V12.5C9.33331 12.845 9.63131 13.125 9.99998 13.125H12C12.3686 13.125 12.6666 12.8456 12.6666 12.5V8.125H14C14.3686 8.125 14.6666 7.84562 14.6666 7.5C14.6666 7.3025 14.564 7.135 14.4113 7.02C12.1226 5.2125 7.99998 1.875 7.99998 1.875Z"
                fill="white"
              />
            </svg>
          </div>
        </div>

        <!-- {#if currentPage === "chat"} -->
        <ChatPage
          {messageLog}
          {agents}
          bind:agent
          {newQuestion}
          {editMessage}
          {generateFollowUpQuestions}
          {generateChart}
          {generateSummary}
          {rerunSql}
          {clearMessages}
          {onUpdateSql}
          {addMessage}
          {abort}
          bind:started
          bind:question_asked
          bind:thinking
          bind:marked_correct
        />
        <!-- {:else if currentPage === "training-data"}
          <TrainingData {trainingData} {removeTrainingData} {onTrain} />
        {:else if currentPage === "report-builder"}
          <ReportGeneratorPage />
        {/if} -->
        <FavoriteModal></FavoriteModal>
        <ThumbsDownModal></ThumbsDownModal>
        <AddFavoriteModal></AddFavoriteModal>
        <UserModal></UserModal>
        <PromptModal></PromptModal>
        <NewPromptModal></NewPromptModal>
        <FeedbackModal></FeedbackModal>
        <ReportIssueModal></ReportIssueModal>
        <Loader></Loader>
      </div>
    </div>
  </div>
</main>
