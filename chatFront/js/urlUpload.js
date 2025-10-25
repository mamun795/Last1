// urlUpload.js
import { appendMessage, showTyping, hideTyping, autoScroll } from './utils.js';
import { sendUrl } from './routes.js';

export function setupURLUpload(uploadBtn, urlInput, urlSection, newUrlBtn, msgInput, sendBtn, chatBody, typing, introText) {

  async function handleUploadURL() {
    const url = urlInput.value.trim();
    if (!url) return alert('Enter a website URL first!');

    introText.style.display = 'none';
    // Show typing while processing
    showTyping(chatBody, typing);
    typing.textContent = 'Processing website...';

    try {
      const data = await sendUrl(url);
      hideTyping(chatBody, typing);

      if (data && (data.message || data.success)) {
        appendMessage('bot', 'Website processed successfully.', chatBody, typing);
      } else {
        appendMessage('bot', 'Could not process website. Check the URL and try again.', chatBody, typing);
      }

      urlSection.style.display = 'none';
      newUrlBtn.style.display = 'block';
      msgInput.disabled = false;
      sendBtn.disabled = false;

      // ensure visible bottom
      autoScroll(chatBody);
    } catch (err) {
      hideTyping(chatBody, typing);
      appendMessage('bot', 'Error processing URL.', chatBody, typing);
    }
  }

  function resetChatForNewURL() {
    const messages = chatBody.querySelectorAll('.message');
    messages.forEach(msg => msg.remove());
    introText.style.display = 'block';
    typing.style.display = 'none';
    urlSection.style.display = 'flex';
    urlInput.value = '';
    newUrlBtn.style.display = 'none';
    msgInput.disabled = true;
    sendBtn.disabled = true;
    msgInput.style.height = '36px';
    sendBtn.style.height = '36px';
    msgInput.style.overflowY = 'hidden';
    chatBody.scrollTop = 0;
  }

  uploadBtn.addEventListener('click', handleUploadURL);
  urlInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUploadURL();
    }
  });
  newUrlBtn.addEventListener('click', resetChatForNewURL);
}
