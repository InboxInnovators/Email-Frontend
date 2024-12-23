// src/utils/summarizeEmail.js
export const summarizeEmail = async (email) => {
    try {
      const response = await fetch('http://localhost:5000/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: email.subject,
          sender: email.sender,
          body: email.body, // Use the full body content for summarization
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to summarize email');
      }
  
      // Read the stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      let summary = '';
  
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value, { stream: true });
        summary += chunk; // Append the chunk to the summary
      }
  
      return summary; // Return the complete summary
    } catch (error) {
      console.error('Error summarizing email:', error);
      throw error; // Rethrow the error for handling in the calling function
    }
  };