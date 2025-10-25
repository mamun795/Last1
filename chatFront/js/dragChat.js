export function makeDraggable(chatbot, header) {
    let isDragging=false, offsetX, offsetY;
    header.addEventListener('mousedown',(e)=>{
        isDragging=true;
        offsetX = e.clientX - chatbot.offsetLeft;
        offsetY = e.clientY - chatbot.offsetTop;
        document.body.style.userSelect='none';
    });
    document.addEventListener('mouseup',()=>{
        isDragging=false;
        document.body.style.userSelect='auto';
    });
    document.addEventListener('mousemove',(e)=>{
        if(!isDragging) return;
        chatbot.style.left = Math.max(0, Math.min(e.clientX - offsetX, window.innerWidth - chatbot.offsetWidth)) + 'px';
        chatbot.style.top = Math.max(0, Math.min(e.clientY - offsetY, window.innerHeight - chatbot.offsetHeight)) + 'px';
        chatbot.style.bottom = 'auto';
        chatbot.style.right = 'auto';
    });
}
