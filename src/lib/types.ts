export type ApiData<T> =
  | { status: "NotRequested" }
  | { status: "Loading" }
  | { status: "Loaded"; data: T }
  | { status: "Error"; error: string };

export type Page = "training-data" | "chat" | "report-builder";

export type MessageContents =
  | { type: "user_question"; question: string; user_id: string }
  | null
  | { prompt: { title: string; prompt: string }[] }
  | { type: "user_question"; question: string }
  | { type: "bot_msg"; message: string }
  | { type: "audience_bot_msg"; message: string; buttons: any[] }
  | { type: "string"; response: string; id: string }
  | { type: "sql"; text: string; id: string }
  | { type: "df"; df: string; text: string; id: string }
  | {
      type: "pdf";
      link: string;
      pdfDownloadUrl: string;
      img: string;
      id: string;
    }
  | {
      type: "plotly_figure";
      question: string;
      fig: string;
      text: string;
      df: string;
      summary: string;
      id: string;
    }
  | {
      type: "success";
      question: string;
      response: string;
      dataframe: string;
      sql_query: string;
      message_id: string;
      fig: string;
    }
  | {
      type: "audience";
      question: string;
      response: string;
      dataframe: string;
      sql_query: string;
      message_id: string;
      fig: string;
      segments: string[];
    }
  | {
      type: "audience_text";
      question: string;
      response: string;
      dataframe: string;
      sql_query: string;
      message_id: string;
      fig: string;
      // segments:string[];
    }
  | {
      type: "text";
      text: string;
      id: string;
    }
  | { type: "error"; error: string }
  | {
      type: "question_cache";
      id: string;
      question: string;
      sql: string;
      df: string;
      fig: string;
      followup_questions: string[];
    }
  | { type: "question_history"; questions: QuestionLink[] }
  | { type: "user_sql" }
  | { type: "follow_up_btn" };

export interface MessageResponse {
  data: MessageContents;
  state: boolean;
}

export type Method = "GET" | "POST";

export type ReportType = "rli" | "upr";

export interface QuestionLink {
  question: string;
  id: string;
}

export type Agent = {
  type: string;
  message: string;
  message2: string;
  message3: string;
  title: string;
  img: string;
  intro: string;
};

export interface Prompt {
  title: string;
  prompt: string;
  description: string;
}
