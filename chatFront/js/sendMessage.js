// sendMessage.js
import { sendMsg } from './routes.js';
import { appendMessage, showTyping, hideTyping, autoScroll } from './utils.js';

export function setupSendMessage(msgInput, sendBtn, chatBody, typing, introText) {
  let typingInterval = null;

  function startTypingAnimation() {
    showTyping(chatBody, typing);
    let dots = 0;
    typing.textContent = 'Thinking';
    typingInterval = setInterval(() => {
      dots = (dots + 1) % 4;
      typing.textContent = 'Thinking' + '.'.repeat(dots);
      // Only auto-scroll if user is near bottom
      autoScroll(chatBody);
    }, 400);
  }

  function stopTypingAnimation() {
    if (typingInterval) {
      clearInterval(typingInterval);
      typingInterval = null;
    }
    hideTyping(chatBody, typing);
  }

  function escapeHtml(s) {
    // Keep user messages safe (we will render them as text)
    return s
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;')
      .replaceAll('\n', '<br>');
  }

  async function sendMessage() {
    const raw = msgInput.value;
    const msg = raw.trim();
    if (!msg) return alert('Please enter a message.');

    // hide intro text
    if (introText) introText.style.display = 'none';

    // Append user message and force scroll to bottom (user expects to see their message)
    appendMessage('user', escapeHtml(msg), chatBody, typing);
    // Ensure immediate visibility of user's own message
    chatBody.scrollTop = chatBody.scrollHeight;

    // reset input
    msgInput.value = '';
    msgInput.style.height = '36px';
    sendBtn.style.height = '36px';
    msgInput.style.overflowY = 'hidden';

    startTypingAnimation();

    // fetch bot reply
    try {
      const data = await sendMsg(msg); // sendMsg should return an object or string
      stopTypingAnimation();
      const botHtml = (data && data.ans) ? data.ans : (typeof data === 'string' ? data : JSON.stringify(data));
      // botHtml likely already contains HTML from marked.parse
      appendMessage('bot', botHtml, chatBody, typing);

      // final scroll: if user was at bottom we keep at bottom (appendMessage already did autoScroll)
      // If the bot message is long, allow a final frame to settle
      requestAnimationFrame(() => {
        autoScroll(chatBody);
      });

    } catch (err) {
      stopTypingAnimation();
      appendMessage('bot', 'Error: could not get response.', chatBody, typing);
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  msgInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // auto-resize input
  const maxInputHeight = 120;
  msgInput.addEventListener('input', () => {
    msgInput.style.height = 'auto';
    let newHeight = msgInput.scrollHeight;
    if (newHeight > maxInputHeight) {
      newHeight = maxInputHeight;
      msgInput.style.overflowY = 'auto';
    } else {
      msgInput.style.overflowY = 'hidden';
    }
    msgInput.style.height = newHeight + 'px';
    sendBtn.style.height = newHeight + 'px';
  });
}
