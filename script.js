document.addEventListener("DOMContentLoaded", function() {
  const API_KEY = "AIzaSyCZAVqoftQlyBUfuFcIdfTpJ9-0mC3ewTM"; // Your API key
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

  // Event listeners for sending messages
  const sendButton = document.getElementById("sendBtn");
  const userInput = document.getElementById("userInput");

  if (sendButton) {
    sendButton.addEventListener("click", sendMessage);
  }

  if (userInput) {
    userInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") sendMessage();
    });
  }

  // Function to send message
  async function sendMessage() {
    const message = userInput.value.trim();

    if (!message) return; // Exit if input is empty

    // Add the user message to chat
    addMessage("user", message);
    userInput.value = ""; // Clear the input field
    showTypingIndicator(true); // Show typing indicator for bot

    try {
      // Sending POST request to Gemini API
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: message, // User's input
                },
              ],
            },
          ],
        }),
      });

      // Parse the response from the API
      const data = await response.json();

      // Check if the API returned valid response
      if (
        data &&
        data.contents &&
        data.contents[0].parts &&
        data.contents[0].parts[0].text
      ) {
        addMessage("bot", data.contents[0].parts[0].text);
      } else {
        addMessage("bot", "Sorry, I couldn't process that.");
      }
    } catch (error) {
      addMessage("bot", "Error: Unable to connect to the API.");
      console.error("Error:", error);
    }
    showTypingIndicator(false); // Hide typing indicator after response
  }

  // Function to show or hide the typing indicator
  function showTypingIndicator(isVisible) {
    const typingIndicator = document.getElementById("typingIndicator");
    typingIndicator.style.display = isVisible ? "flex" : "none";
  }

  // Function to add messages to chat container
  function addMessage(sender, text) {
    const chatBox = document.getElementById("chatBox");
    const messageDiv = document.createElement("div");
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.innerText = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
  }
});
