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

const EmailView = () => {
  const { emailId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState('');
  const [isStarred, setIsStarred] = useState(false);
  
  // Get email from location state
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      // If email data is not available, redirect back to inbox
      navigate('/');
    }
    setIsStarred(email?.starred || false);
  }, [email, navigate]);

  const handleBack = () => {
    navigate('/');
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

  if (!email) return null;

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Email view header */}
      <div className="border-b p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button onClick={handleBack} className="md:hidden">
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold">{email.subject}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => navigate('/')}>
              <Reply className="h-5 w-5" />
            </button>
            <button onClick={() => navigate('/email/forward')}>
              <Forward className="h-5 w-5" />
            </button>
            <button onClick={() => setIsStarred(!isStarred)}>
              <Star className={`h-5 w-5 ${isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            </button>
            <button>
              <Archive className="h-5 w-5" />
            </button>
            <button>
              <Trash2 className="h-5 w-5" />
            </button>
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
                <h2 className="font-semibold">{email.sender?.emailAddress?.name || 'Unknown Sender'}</h2>
                <p className="text-sm text-gray-500">To: {email.toRecipients?.map(recipient => recipient.emailAddress.name).join(', ') || 'No Recipients'}</p>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(email.sentDateTime).toLocaleString()} {/* Format the date as needed */}
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
    </div>
  );
};

export default EmailView; 