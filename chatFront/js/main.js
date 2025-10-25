import { toggleChat } from './toggleChat.js';
import { makeDraggable } from './dragChat.js';
import { setupSendMessage } from './sendMessage.js';
import { setupURLUpload } from './urlUpload.js';
import { sendUrl } from './routes.js';


export const launcher = document.getElementById('chatbot-launcher');
export const chatbot = document.getElementById('chatbot');
export const sendBtn = document.getElementById('send-btn');
export const msgInput = document.getElementById('msg-input');
export const chatBody = document.getElementById('chat-body');
export const typing = document.getElementById('typing');
export const introText = document.getElementById('intro-text');
export const uploadBtn = document.getElementById('upload-url-btn');
export const urlInput = document.getElementById('url-input');
export const urlSection = document.getElementById('url-section');
export const newUrlBtn = document.getElementById('new-url-btn');
export const header = document.getElementById('chat-header');

// Initialize all features
toggleChat(launcher, chatbot);
makeDraggable(chatbot, header);
setupSendMessage(msgInput, sendBtn, chatBody, typing, introText);
setupURLUpload(uploadBtn, urlInput, urlSection, newUrlBtn, msgInput, sendBtn, chatBody, typing, introText);

// uploadBtn.addEventListener("click", sendUrl);
// urlInput.addEventListener("keypress", (e) => {
//   if (e.key === "Enter") sendUrl();
// });

// sendBtn.addEventListener("click", sendMsg);
// msgInput.addEventListener("keypress", (e) => {
//   if (e.key === "Enter") sendMsg();
// });

