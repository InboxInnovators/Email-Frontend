import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Reply, 
  Forward, 
  Star, 
  Archive,
  Trash2,
  Sparkles
} from 'lucide-react';
import useStore from '../useStore';
import EmailCompose from './EmailCompose'; // Import EmailCompose
import TranslateModal from './TranslateModal'; // Import the TranslateModal

const EmailView = () => {
  const { setEmail } = useStore((state) => state); // Get setEmail from Zustand store
  const { id } = useParams(); // Use 'id' to get the email ID from the URL
  const navigate = useNavigate();
  const location = useLocation();
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState('');
  const [isStarred, setIsStarred] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false); // State to control compose modal
  const [composeTo, setComposeTo] = useState(''); // State for the "To" field in compose modal
  const [isTranslateOpen, setIsTranslateOpen] = useState(false); // State to control translate modal
  
  // Get email from location state
  const email = location.state?.email;
  console.log('Email from location state:', email); // Log the email from location state

  useEffect(() => {
    if (!email) {
      navigate('/emails');
    } else {
      console.log('Setting email in store:', email); // Log the email object
      setEmail(email);
      setIsStarred(email?.starred || false);
    }
  }, [email, navigate, setEmail]);

  const handleBack = () => {
    navigate('/emails'); // Navigate back to the email list
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      // Log the email object for debugging
      console.log('Email object:', email);

      // Check if email body and content are defined
      if (!email.preview || typeof email.preview !== 'string') {
        throw new Error('Email body content is not available or invalid');
      }

      const response = await fetch('http://localhost:5000/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: email.subject,
          sender: email.sender,
          body: email.preview, // Ensure this is defined and valid
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to summarize email');
      }

      const data = await response.json();
      setSummary(data.summary); // Assuming the response contains a 'summary' field
    } catch (error) {
      console.error('Error summarizing email:', error);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleReply = () => {
    setComposeTo(email.sender.address); // Set the "To" field with the sender's email address
    setIsComposeOpen(true); // Open the compose modal
  };

  const handleTranslate = () => {
    const emailFromStore = useStore.getState().email; // Get email from Zustand store
    console.log('Translating content:', emailFromStore.body?.content); // Log the content to be translated
    setIsTranslateOpen(true); // Open the translate modal
  };

  if (!email) return null;

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Email view header */}
      <div className="border-b p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <button onClick={handleBack} className="flex items-center space-x-2 text-blue-600">
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <h1 className="text-xl font-semibold">{email.subject}</h1>
          <div className="flex items-center space-x-2">
            <button onClick={handleReply}><Reply className="h-5 w-5" /></button>
            <button onClick={() => navigate('/email/forward')}><Forward className="h-5 w-5" /></button>
            <button onClick={() => setIsStarred(!isStarred)}>
              <Star className={`h-5 w-5 ${isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            </button>
            <button onClick={handleTranslate}><Sparkles className="h-5 w-5" /></button>
            <button><Archive className="h-5 w-5" /></button>
            <button><Trash2 className="h-5 w-5" /></button>
          </div>
        </div>
      </div>

      {/* Email content */}
      <div className="flex-1 overflow-auto p-3 sm:p-6">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {/* Sender info */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">From: {email.sender.name || 'Unknown Sender'} ({email.sender.address || 'No Address Available'})</h2>
                <p className="text-sm text-gray-500">Time: {email.time || 'No Time Available'}</p>
              </div>
            </div>

            {/* Body Preview of the email */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">{email.preview || 'No content available'}</p>
            </div>

            {/* AI Summary button */}
            <div className="flex justify-end">
              <button
                onClick={handleSummarize}
                className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
                disabled={isSummarizing}
              >
                <Sparkles className="h-4 w-4" />
                <span>{isSummarizing ? 'Summarizing...' : 'AI Summary'}</span>
              </button>
            </div>

            {/* Summary if available */}
            {summary && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">AI Summary</h3>
                <p className="text-sm text-gray-600">{summary}</p>
              </div>
            )}

            {/* Email content - now using the actual content from email data */}
            <div className="prose max-w-none whitespace-pre-wrap">
              {email.body?.contentType === 'html' ? (
                <div dangerouslySetInnerHTML={{ __html: email.body?.content }} />
              ) : (
                <p>{email.body?.content}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Render EmailCompose Modal */}
      {isComposeOpen && <EmailCompose onClose={() => setIsComposeOpen(false)} to={composeTo} />}
      {/* Render TranslateModal */}
      {isTranslateOpen && <TranslateModal onClose={() => setIsTranslateOpen(false)} text={email.body?.content} />}
    </div>
  );
};

export default EmailView; 