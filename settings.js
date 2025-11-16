// Settings page functionality

const serviceRadios = document.querySelectorAll('input[name="service"]');
const serviceCards = document.querySelectorAll('.service-card');
const sections = {
  groq: document.getElementById('groqSection'),
  gemini: document.getElementById('geminiSection'),
  ollama: document.getElementById('ollamaSection'),
  openrouter: document.getElementById('openrouterSection')
};
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const statusMessage = document.getElementById('statusMessage');
const refreshOllamaModelsBtn = document.getElementById('refreshOllamaModels');
const ollamaModelSelect = document.getElementById('ollamaModel');

// Show/hide sections based on selected service
function updateSections() {
  const selectedService = document.querySelector('input[name="service"]:checked').value;
  
  // Hide all sections
  Object.values(sections).forEach(section => {
    section.classList.remove('active');
  });
  
  // Show selected section
  sections[selectedService].classList.add('active');
  
  // Update card styling
  serviceCards.forEach(card => {
    card.classList.remove('active');
  });
  document.querySelector(`label[for="${selectedService}"]`).classList.add('active');
  
  // Fetch Ollama models if Ollama is selected
  if (selectedService === 'ollama') {
    fetchOllamaModels();
  }
}

// Fetch available models from Ollama API
async function fetchOllamaModels() {
  const ollamaUrl = document.getElementById('ollamaUrl').value || 'http://localhost:11434';
  const helpText = document.getElementById('ollamaModelHelp');
  
  // Store the currently selected value
  const currentValue = ollamaModelSelect.value;
  
  // Show loading state
  ollamaModelSelect.innerHTML = '<option value="">Loading models...</option>';
  ollamaModelSelect.disabled = true;
  refreshOllamaModelsBtn.disabled = true;
  
  try {
    const response = await fetch(`${ollamaUrl}/api/tags`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.models && data.models.length > 0) {
      // Clear and populate dropdown with models
      ollamaModelSelect.innerHTML = '';
      
      data.models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.name;
        option.textContent = model.name;
        ollamaModelSelect.appendChild(option);
      });
      
      // Restore previously selected value if it exists in the list
      if (currentValue && data.models.some(m => m.name === currentValue)) {
        ollamaModelSelect.value = currentValue;
      }
      
      helpText.textContent = `Found ${data.models.length} model(s) in your local Ollama instance`;
      helpText.className = 'form-text text-success';
    } else {
      ollamaModelSelect.innerHTML = '<option value="">No models found</option>';
      helpText.textContent = 'No models found. Please pull a model using "ollama pull <model-name>"';
      helpText.className = 'form-text text-warning';
    }
  } catch (error) {
    console.error('Error fetching Ollama models:', error);
    ollamaModelSelect.innerHTML = '<option value="">Error loading models</option>';
    helpText.textContent = `Error: ${error.message}. Make sure Ollama is running at ${ollamaUrl}`;
    helpText.className = 'form-text text-danger';
  } finally {
    ollamaModelSelect.disabled = false;
    refreshOllamaModelsBtn.disabled = false;
  }
}

// Load settings
function loadSettings() {
  chrome.storage.sync.get(['settings'], (result) => {
    if (result.settings) {
      const settings = result.settings;
      
      // Set service
      if (settings.service) {
        const radio = document.querySelector(`input[value="${settings.service}"]`);
        if (radio) {
          radio.checked = true;
          updateSections();
        }
      }
      
      // Groq settings
      if (settings.groqApiKey) {
        document.getElementById('groqApiKey').value = settings.groqApiKey;
      }
      if (settings.groqModel) {
        document.getElementById('groqModel').value = settings.groqModel;
      }
      
      // Gemini settings
      if (settings.geminiApiKey) {
        document.getElementById('geminiApiKey').value = settings.geminiApiKey;
      }
      if (settings.geminiModel) {
        document.getElementById('geminiModel').value = settings.geminiModel;
      }
      
      // Ollama settings
      if (settings.ollamaUrl) {
        document.getElementById('ollamaUrl').value = settings.ollamaUrl;
      }
      if (settings.ollamaModel) {
        document.getElementById('ollamaModel').value = settings.ollamaModel;
      }
      
      // OpenRouter settings
      if (settings.openRouterApiKey) {
        document.getElementById('openRouterApiKey').value = settings.openRouterApiKey;
      }
      if (settings.openRouterModel) {
        document.getElementById('openRouterModel').value = settings.openRouterModel;
      }
    }
  });
}

// Save settings
function saveSettings() {
  const selectedService = document.querySelector('input[name="service"]:checked').value;
  
  const settings = {
    service: selectedService,
    groqApiKey: document.getElementById('groqApiKey').value,
    groqModel: document.getElementById('groqModel').value || 'mixtral-8x7b-32768',
    geminiApiKey: document.getElementById('geminiApiKey').value,
    geminiModel: document.getElementById('geminiModel').value || 'gemini-pro',
    ollamaUrl: document.getElementById('ollamaUrl').value,
    ollamaModel: document.getElementById('ollamaModel').value || 'llama2',
    openRouterApiKey: document.getElementById('openRouterApiKey').value,
    openRouterModel: document.getElementById('openRouterModel').value || 'anthropic/claude-3.5-sonnet'
  };
  
  // Validate based on selected service
  if (selectedService === 'groq' && !settings.groqApiKey) {
    showStatus('Please enter your Groq API key', 'danger');
    return;
  }
  
  if (selectedService === 'gemini' && !settings.geminiApiKey) {
    showStatus('Please enter your Gemini API key', 'danger');
    return;
  }
  
  if (selectedService === 'ollama' && !settings.ollamaUrl) {
    showStatus('Please enter your Ollama URL', 'danger');
    return;
  }
  
  if (selectedService === 'openrouter' && !settings.openRouterApiKey) {
    showStatus('Please enter your OpenRouter API key', 'danger');
    return;
  }
  
  chrome.storage.sync.set({ settings }, () => {
    showStatus('Settings saved successfully!', 'success');
  });
}

// Reset to defaults
function resetSettings() {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    const defaultSettings = {
      service: 'groq',
      groqApiKey: '',
      groqModel: 'mixtral-8x7b-32768',
      geminiApiKey: '',
      geminiModel: 'gemini-pro',
      ollamaUrl: 'http://localhost:11434',
      ollamaModel: 'llama2',
      openRouterApiKey: '',
      openRouterModel: 'anthropic/claude-3.5-sonnet'
    };
    
    chrome.storage.sync.set({ settings: defaultSettings }, () => {
      loadSettings();
      showStatus('Settings reset to defaults', 'success');
    });
  }
}

// Show status message
function showStatus(message, type) {
  statusMessage.innerHTML = `
    <div class="alert alert-${type}">
      ${message}
      <button type="button" class="alert-close">×</button>
    </div>
  `;
  
  // Add event listener to close button
  const closeBtn = statusMessage.querySelector('.alert-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      statusMessage.innerHTML = '';
    });
  }
  
  setTimeout(() => {
    statusMessage.innerHTML = '';
  }, 3000);
}

// Event listeners
serviceRadios.forEach(radio => {
  radio.addEventListener('change', updateSections);
});

serviceCards.forEach(card => {
  card.addEventListener('click', () => {
    const radio = card.querySelector('input[type="radio"]');
    radio.checked = true;
    updateSections();
  });
});

saveBtn.addEventListener('click', saveSettings);
resetBtn.addEventListener('click', resetSettings);
refreshOllamaModelsBtn.addEventListener('click', fetchOllamaModels);

// Also fetch models when Ollama URL changes
document.getElementById('ollamaUrl').addEventListener('blur', () => {
  const selectedService = document.querySelector('input[name="service"]:checked').value;
  if (selectedService === 'ollama') {
    fetchOllamaModels();
  }
});

// Initialize
loadSettings();
updateSections();
