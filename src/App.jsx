import { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer.jsx';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start py-0 font-sans">
      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto mt-10 mb-12 p-8 rounded-2xl bg-gradient-to-br from-green-900 to-green-700 shadow-xl text-white relative">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">PhotoStory</h1>
          <h2 className="text-xl md:text-2xl font-medium mb-4 opacity-90">Because Every Photo Deserves a Story</h2>
          <p className="max-w-2xl mx-auto text-lg opacity-90 mb-6">
            Transform your photos into compelling stories in seconds.
          </p>
          <p className="max-w-2xl mx-auto text-lg opacity-90 mb-6">
            Our AI sees not just what's in your images, but the emotions they represent.
          </p>
        </div>
      </section>

      {/* Main App Section */}
      <div id="main-app" className="w-full flex flex-col items-center">
        {/* API Key Input */}
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 mb-6 flex flex-col gap-2 border border-gray-200">
          <label htmlFor="api-key" className="text-sm font-semibold text-gray-700 mb-1">OpenAI API Key</label>
          <input
            id="api-key"
            type="password"
            className="px-4 py-2 border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary/60 text-gray-900"
            placeholder="sk-..."
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
          />
          <span className="text-xs text-gray-500 mt-1">Your key is used only in your browser to generate copy with AI. <a href="https://platform.openai.com/api-keys" target="_blank" className="underline">Get an API key</a></span>
        </div>

        {/* Photo Upload Area */}
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 mb-8 flex flex-col items-center border border-gray-200">
          <label className="block w-full mb-2 text-sm font-semibold text-gray-700">Upload an Image</label>
          <input
            type="file"
            accept="image/*"
            className="mb-4"
            onChange={e => setPhoto(e.target.files[0])}
          />
          {photo && (
            <img
              src={URL.createObjectURL(photo)}
              alt="Preview"
              className="max-h-48 rounded shadow mb-2"
            />
          )}
          <button
            className="mt-2 bg-primary hover:bg-yellow-400 text-green-dark font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
            disabled={!apiKey || !photo || loading}
            onClick={async () => {
              setError('');
              setDescription('');
              setLoading(true);
              try {
                // Convert image to base64
                const fileData = await new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => resolve(reader.result);
                  reader.onerror = reject;
                  reader.readAsDataURL(photo);
                });
                // Extract base64 string
                const base64 = fileData.split(',')[1];
                // Call OpenAI API
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                  },
                  body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [
                      {
                        role: 'user',
                        content: [
                          { type: 'text', text: "You are a master storyteller who sees the human stories hidden within images. Look at this image and tell the story you see - not just what's happening, but the emotions, the context, the 'why' behind the moment. Focus on the human element and emotional connection, what happened just before this moment and what might happen next, the details that others might miss but you find fascinating, and why this moment matters to someone. Write in a natural, conversational tone as if you're sharing an interesting observation with a friend. Avoid marketing jargon, emojis, or sales-focused language. Instead, craft authentic content that makes people pause, connect, and care about what they're seeing. Keep your response under 1000 characters." },
                          { type: 'image_url', image_url: { "url": `data:${photo.type};base64,${base64}` } }
                        ]
                      }
                    ],
                    max_tokens: 300,
                  }),
                });
                if (!response.ok) {
                  const err = await response.json().catch(() => ({}));
                  throw new Error(err.error?.message || 'Failed to get professional copy from OpenAI.');
                }
                const data = await response.json();
                setDescription(data.choices?.[0]?.message?.content || 'No copy returned.');
              } catch (err) {
                setError(err.message || 'An unknown error occurred.');
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? 'Generating copy...' : 'Generate Story'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-lg shadow p-6 mb-6 text-red-800">
            <h3 className="font-semibold mb-2">Error:</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Result Area */}
        {description && (
          <div className="w-full max-w-md bg-gradient-to-br from-green-50 to-yellow-50 border border-green-200 rounded-xl shadow-lg p-6 mb-8 text-green-900 animate-fade-in relative">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">This Image Tells a Story:</h3>
              <button
                className="ml-2 px-3 py-1 text-xs font-semibold bg-primary/80 text-green-dark rounded hover:bg-primary transition-colors shadow active:scale-95"
                onClick={() => {
                  navigator.clipboard.writeText(description);
                }}
                title="Copy to clipboard"
              >
                Copy
              </button>
            </div>
            <div className="prose prose-green max-w-none whitespace-pre-wrap overflow-auto max-h-80 transition-all duration-300" style={{ scrollbarColor: '#FFC72C #FAFAF5' }}>
              <MarkdownRenderer>{description}</MarkdownRenderer>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-auto py-6 text-gray-400 text-sm text-center w-full border-t border-gray-100">
          &copy; 2025 PhotoStory
        </footer>
      </div> {/* Close main-app wrapper */}
    </div>
  );
}

export default App;
