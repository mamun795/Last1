const BASE_URL = "http://127.0.0.1:8000";
// routes.js
export async function sendUrl(url) {
    try {
        const response = await fetch("http://127.0.0.1:8000/process_url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ web: url })
        });

        const data = await response.json();
        console.log("Process URL response:", data);
        return data;
    } catch (error) {
        console.error("Error processing URL:", error);
        return { message: "Failed to process URL" };
    }
}


export async function sendMsg(msg) {
 // const msg = msgInput.value;
  if (!msg.trim()) return alert("Please enter a message.");

  try {
    const res = await fetch(`${BASE_URL}/send_msg`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ web: msg }),
    });

    const data = await res.json();
    console.log(data.ans);
    //const sanitized = data.ans.replace(/\*\*(.*?)\*\*/g, "$1"); // Remove markdown bold
    //console.log(sanitized);
    const formatted = marked.parse(data.ans);
    console.log(formatted);
    return formatted;

  } catch (err) {
    return {"Error":'Error'}
  }
}

