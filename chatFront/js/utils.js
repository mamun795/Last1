// utils.js
export function appendMessage(sender, html, chatBody, typing) {
  const div = document.createElement('div');
  div.className = sender === 'user' ? 'message user-msg' : 'message bot-msg';
  div.innerHTML = html;

  // If typing indicator is currently attached to chatBody, insert new message before it
  if (typing && typing.parentElement === chatBody) {
    chatBody.insertBefore(div, typing);
  } else {
    chatBody.appendChild(div);
  }

  // Wait a frame so layout (and images/code blocks) can settle, then auto-scroll if user was near bottom
  requestAnimationFrame(() => {
    autoScroll(chatBody);
  });

  return div;
}

export function isUserNearBottom(chatBody, threshold = 150) {
  // if user is within `threshold` px from bottom we consider them at bottom
  return chatBody.scrollHeight - chatBody.scrollTop - chatBody.clientHeight <= threshold;
}

export function autoScroll(chatBody) {
  if (isUserNearBottom(chatBody)) {
    chatBody.scrollTop = chatBody.scrollHeight;
  }
}

export function scrollToBottom(chatBody) {
  chatBody.scrollTop = chatBody.scrollHeight;
}

/* Show typing element at the bottom (attach it to the chat body).
   We append it so it always appears after all messages.
*/
export function showTyping(chatBody, typing) {
  if (!typing) return;
  if (typing.parentElement !== chatBody) chatBody.appendChild(typing);
  typing.style.display = 'block';
  // Ensure we remain scrolled to bottom while typing is visible if user already at bottom
  autoScroll(chatBody);
}

/* Hide and detach typing element so the last bot message becomes the visible bottom item */
export function hideTyping(chatBody, typing) {
  if (!typing) return;
  typing.style.display = 'none';
  if (typing.parentElement === chatBody) {
    chatBody.removeChild(typing);
  }
  // After removing typing, keep scroll position sensible:
  // if user was near bottom, snap to bottom so full bot response is visible
  if (isUserNearBottom(chatBody)) {
    scrollToBottom(chatBody);
  }
}
