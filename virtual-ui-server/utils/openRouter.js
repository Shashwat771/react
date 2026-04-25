import axios from "axios";

// Fallback models in case the primary model is rate-limited
const FALLBACK_MODELS = [
  "openai/gpt-4o-mini",  // Faster and more available
  "meta-llama/llama-3.1-8b-instruct"  // Open source alternative
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const askAI = async (messages, retries = 3) => {
  try {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Messages array is empty.");
    }

    const primaryModel = "deepseek/deepseek-chat";
    let lastError = null;

    // Try primary model first with retry logic
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        console.log(`🤖 Attempting API call (${attempt + 1}/${retries}) with model: ${primaryModel}`);
        
        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: primaryModel,
            messages: messages,
            temperature: 0.7,
            max_tokens: 2000,
            response_format: { type: "json_object" }
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
              "X-Title": "Component Generator"
            },
            timeout: 30000 // 30 second timeout
          }
        );

        const content = response?.data?.choices?.[0]?.message?.content;

        if (!content || !content.trim()) {
          throw new Error("AI returned empty response.");
        }

        return content;

      } catch (error) {
        lastError = error;
        const statusCode = error.response?.status;
        const errorData = error.response?.data;

        // If it's a rate limit error (429), wait and retry
        if (statusCode === 429) {
          const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
          console.warn(`⏱️ Rate limited (429). Waiting ${waitTime}ms before retry...`);
          console.warn(`Message: ${errorData?.error?.message}`);
          await sleep(waitTime);
          continue; // Try again
        }

        // If it's a different error, break and try fallback models
        console.error(`API Error (${statusCode}):`, errorData?.error?.message || error.message);
        break;
      }
    }

    // If primary model fails, try fallback models
    console.warn("⚠️ Primary model exhausted. Trying fallback models...");
    
    for (const fallbackModel of FALLBACK_MODELS) {
      try {
        console.log(`🔄 Trying fallback model: ${fallbackModel}`);
        
        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: fallbackModel,
            messages: messages,
            temperature: 0.7,
            max_tokens: 2000,
            response_format: { type: "json_object" }
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
              "X-Title": "Component Generator"
            },
            timeout: 30000
          }
        );

        const content = response?.data?.choices?.[0]?.message?.content;
        
        if (!content || !content.trim()) {
          throw new Error("AI returned empty response.");
        }

        console.log(`✅ Success with fallback model: ${fallbackModel}`);
        return content;

      } catch (fallbackError) {
        console.error(`Fallback ${fallbackModel} failed:`, fallbackError.response?.data?.error?.message || fallbackError.message);
        continue;
      }
    }

    // All models failed
    throw lastError || new Error("All API models failed");

  } catch (error) {
    console.error("OpenRouter Error:", error.response?.data || error.message);
    throw new Error("OpenRouter API Error");
  }
};