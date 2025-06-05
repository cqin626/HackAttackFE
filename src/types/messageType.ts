export interface Attachment {
  filename: string;
  mimeType: string;
  attachmentId: string;
}

export interface Message {
  from: string;
  subject: string;
  body: string;
  receivedAt: string;
  attachments: Attachment[];
  messageId: string;
  threadId:string;
}
