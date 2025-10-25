export function toggleChat(launcher, chatbot) {
    launcher.addEventListener('click', () => {
        chatbot.style.display = chatbot.style.display==='flex'?'none':'flex';
    });
}
