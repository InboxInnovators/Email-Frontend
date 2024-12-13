import { useState } from 'react';
import axios from 'axios';
import useStore from '../useStore'; // Import the store

const TranslateModal = ({ onClose }) => {
  const { email } = useStore((state) => state); // Get email from Zustand store
  console.log('Email from store in TranslateModal:', email); // Log the email from store
  const [sourceLanguage, setSourceLanguage] = useState('en'); // Default source language
  const [targetLanguage, setTargetLanguage] = useState('es'); // Default target language
  const [translation, setTranslation] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(''); // State to hold error messages

  // Define the translateText function
  const translateText = async (text, sourceLanguage, targetLanguage) => {
    console.log('Content to translate');
    console.log(text);
    const response = await fetch('http://localhost:5000/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage,
      }),
    });

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const result = await response.json();
    console.log('Translation API response:', result); // Log the API response
    return result.result;
  };

  const handleTranslate = async () => {
    setIsTranslating(true);
    try {
      const emailContent = email.body?.content || email.preview; // Fallback to preview if body is not available
      console.log('Translating content:', emailContent); // Log the content to be translated
      
      // Call the translateText function
      const translatedText = await translateText(emailContent, sourceLanguage, targetLanguage);
      console.log('Translated text:', translatedText); // Log the translated text
      setTranslation(translatedText); // Set the translation state
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">Translate Email</h2>
        <textarea
          value={email.body?.content || email.preview || ''} // Display email content or fallback to preview
          readOnly
          className="w-full h-24 p-2 border border-gray-300 rounded mb-4"
        />
        <div className="mb-4">
          <label className="block mb-1">Source Language:</label>
          <select
            value={sourceLanguage}
            onChange={(e) => setSourceLanguage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            {/* Add more languages as needed */}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Target Language:</label>
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="es">Spanish</option>
            <option value="en">English</option>
            <option value="fr">French</option>
            {/* Add more languages as needed */}
          </select>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleTranslate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            disabled={isTranslating}
          >
            {isTranslating ? 'Translating...' : 'Translate'}
          </button>
          <button
            onClick={onClose}
            className="ml-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Close
          </button>
        </div>
        {error && <div className="mt-4 text-red-500">{error}</div>} {/* Display error message */}
        {translation && (
          <div className="mt-4">
            <h3 className="font-medium">Translation:</h3>
            <p className="text-gray-600">{translation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslateModal;