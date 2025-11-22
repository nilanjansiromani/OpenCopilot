// AI Service integration for Groq, Gemini, Ollama, and OpenRouter

class AIService {
  constructor(settings) {
    this.settings = settings;
  }
  
  async sendMessage(messages, systemPrompt = '') {
    const { service } = this.settings;
    
    switch (service) {
      case 'groq':
        return this.sendToGroq(messages, systemPrompt);
      case 'ollama':
        return this.sendToOllama(messages, systemPrompt);
      case 'openrouter':
        return this.sendToOpenRouter(messages, systemPrompt);
      case 'gemini':
        return this.sendToGemini(messages, systemPrompt);
      default:
        throw new Error('Invalid service selected');
    }
  }
  
  async sendToGroq(messages, systemPrompt) {
    const { groqApiKey, groqModel = 'mixtral-8x7b-32768' } = this.settings;
    
    if (!groqApiKey) {
      throw new Error('Groq API key not configured. Please add it in settings.');
    }
    
    const formattedMessages = systemPrompt 
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages;
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}`
      },
      body: JSON.stringify({
        model: groqModel,
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 2048
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Groq API request failed');
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  }
  
  async sendToOllama(messages, systemPrompt) {
    const { ollamaUrl = 'http://localhost:11434', ollamaModel = 'llama2' } = this.settings;
    
    const formattedMessages = systemPrompt 
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages;
    
    try {
      const response = await fetch(`${ollamaUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: ollamaModel,
          messages: formattedMessages,
          stream: false
        })
      });
      
      if (!response.ok) {
        throw new Error('Ollama request failed. Make sure Ollama is running.');
      }
      
      const data = await response.json();
      return data.message.content;
    } catch (error) {
      throw new Error(`Ollama connection failed: ${error.message}. Make sure Ollama is running on ${ollamaUrl}`);
    }
  }
  
  async sendToOpenRouter(messages, systemPrompt) {
    const { openRouterApiKey, openRouterModel = 'anthropic/claude-3.5-sonnet' } = this.settings;
    
    if (!openRouterApiKey) {
      throw new Error('OpenRouter API key not configured. Please add it in settings.');
    }
    
    const formattedMessages = systemPrompt 
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages;
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterApiKey}`,
        'HTTP-Referer': window.location.href,
        'X-Title': 'OpenCopilot Extension'
      },
      body: JSON.stringify({
        model: openRouterModel,
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 2048
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenRouter API request failed');
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  }
  
  async sendToGemini(messages, systemPrompt) {
    const { geminiApiKey, geminiModel = 'gemini-pro' } = this.settings;
    
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured. Please add it in settings.');
    }
    
    // Convert messages to Gemini format
    let prompt = '';
    if (systemPrompt) {
      prompt = systemPrompt + '\n\n';
    }
    
    // Gemini uses a different format - combine all messages into a conversation
    messages.forEach(msg => {
      if (msg.role === 'user') {
        prompt += `User: ${msg.content}\n\n`;
      } else if (msg.role === 'assistant') {
        prompt += `Assistant: ${msg.content}\n\n`;
      }
    });
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048
          }
        })
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Gemini API request failed');
    }
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }
}

