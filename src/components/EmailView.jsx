import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Reply, 
  Forward, 
  Star, 
  Archive,
  Trash2,
  Sparkles,
  Languages,
  Cloudy
} from 'lucide-react';
import useStore from '../useStore';
import EmailCompose from './EmailCompose'; // Import EmailCompose
import TranslateModal from './TranslateModal'; // Import the TranslateModal
import { PDFDocument } from 'pdf-lib'; // Import PDFDocument from pdf-lib
import SalesforceDetailsModal from './SalesforceDetailsModal'; // Import the new modal component
import { toast } from 'sonner';

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
  const [salesforceDetails, setSalesforceDetails] = useState(null); // State for Salesforce details
  const [attachments, setAttachments] = useState([]); // State for attachments
  const [pdfData, setPdfData] = useState(null); // State for PDF data
  const [isSalesforceModalOpen, setIsSalesforceModalOpen] = useState(false); // State for modal visibility

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
      fetchAttachments(email.id); // Fetch attachments using the email ID
    }
  }, [email, navigate, setEmail]);

  const fetchAttachments = async (emailId) => {
    try {
      const accessToken = useStore.getState().accessToken; // Get access token from Zustand store
      const response = await fetch(
        `https://graph.microsoft.com/v1.0/me/messages/${emailId}/attachments`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Pass your access token
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch attachments');
      }

      const data = await response.json();
      setAttachments(data.value); // Set the attachments in state
    } catch (error) {
      console.error('Error fetching attachments:', error);
    }
  };

  const handleBack = () => {
    navigate('/emails'); // Navigate back to the email list
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setSummary('Summarizing...'); // Set initial summary text immediately
    try {
        console.log('Email object:', email);

        // Check if email body content is defined and valid
        if (!email.body || typeof email.body !== 'string') {
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

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunk = decoder.decode(value, { stream: true });
            setSummary((prev) => prev + chunk); // Append the chunk to the summary
        }
    } catch (error) {
        console.error('Error summarizing email:', error);
        toast.error('Error summarizing email');
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
    console.log('Translating content:', emailFromStore.body); // Log the content to be translated
    setIsTranslateOpen(true); // Open the translate modal
  };

  const handleGetSalesforceInfo = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getEmailDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.sender.address }), // Send the sender's email to the backend
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Salesforce details');
      }

      const data = await response.json();
      setSalesforceDetails(data.details); // Set the fetched details in state
      console.log('Salesforce details:', data.details); // Log the details
      setIsSalesforceModalOpen(true); // Open the modal
    } catch (error) {
      console.error('Error fetching Salesforce details:', error);
      toast.error('Error fetching Salesforce details');
    }
  };

  const closeModal = () => {
    setIsSalesforceModalOpen(false); // Close the modal
  };

  const handleDeleteEmail = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/deleteMessage', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: useStore.getState().accessToken, // Get access token from Zustand store
          messageId: email.id, // Use the email ID to delete
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete email');
      }

      // Optionally, navigate back to the email list or show a success message
      console.log('Email deleted successfully');
      navigate('/emails'); // Navigate back to the email list after deletion
    } catch (error) {
      console.error('Error deleting email:', error);
      toast.error('Error deleting the email.');
    }
  };

  const displayPdf = async (contentBytes) => {
    const uint8Array = new Uint8Array(atob(contentBytes).split("").map(char => char.charCodeAt(0)));
    const pdfDoc = await PDFDocument.load(uint8Array);
    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    setPdfData(pdfDataUri); // Set the PDF data URI to state
  };

  const handleAttachmentClick = (attachment) => {
    if (attachment["@odata.mediaContentType"] === "application/pdf") {
      displayPdf(attachment.contentBytes); // Display PDF if the attachment is a PDF
    } else {
      // Handle other attachment types if necessary
      const link = document.createElement('a');
      link.href = `data:${attachment["@odata.mediaContentType"]};base64,${attachment.contentBytes}`;
      link.download = attachment.name;
      link.click();
    }
  };

  if (!email) return null;

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Email view header */}
      <div className="border-b p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <button onClick={handleBack} className="flex items-center space-x-2 text-blue-600 mb-2 sm:mb-0">
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <h1 className="text-xl font-semibold text-center sm:text-left sm:flex-1">{email.subject}</h1>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <button onClick={handleReply}><Reply className="h-5 w-5" /></button>
            <button onClick={handleReply}><Forward className="h-5 w-5" /></button>
            <button onClick={() => setIsStarred(!isStarred)}>
              <Star className={`h-5 w-5 ${isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            </button>
            <button onClick={handleTranslate}><Languages className="h-5 w-5" /></button>
            <button><Archive className="h-5 w-5" /></button>
            <button onClick={handleDeleteEmail}><Trash2 className="h-5 w-5 text-red-600 hover:text-red-800" /></button>
            <button 
              onClick={handleGetSalesforceInfo} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              Get Info
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
                <h2 className="font-semibold">From: {email.sender.name || 'Unknown Sender'} ({email.sender.address || 'No Address Available'})</h2>
                <p className="text-sm text-gray-500">Time: {email.time || 'No Time Available'}</p>
              </div>
            </div>

            {/* Email body */}
            <div className="prose max-w-none whitespace-pre-wrap">
              <div dangerouslySetInnerHTML={{ __html: email.body }} />
            </div>

            {/* AI Summary section */}
            {summary && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">AI Summary</h3>
                <p className="text-sm text-gray-600">{summary}</p>
              </div>
            )}

            {/* Attachments section */}
            {attachments.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Attachments</h3>
                <ul className="list-disc pl-5">
                  {attachments.map((attachment) => (
                    <li key={attachment.id} className="text-sm text-gray-700">
                      <button 
                        onClick={() => handleAttachmentClick(attachment)} 
                        className="text-blue-600 hover:underline"
                      >
                        {attachment.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* PDF Viewer */}
            {pdfData && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">PDF Preview</h3>
                <iframe src={pdfData} width="100%" height="500px" />
              </div>
            )}

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

            {/* Salesforce details if available */}
            {salesforceDetails && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Salesforce Details</h3>
                <pre className="text-sm text-gray-600">{JSON.stringify(salesforceDetails, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Render EmailCompose Modal */}
      {isComposeOpen && <EmailCompose onClose={() => setIsComposeOpen(false)} to={composeTo} />}
      {/* Render TranslateModal */}
      {isTranslateOpen && <TranslateModal onClose={() => setIsTranslateOpen(false)} text={email.body} />}
      {/* Render SalesforceDetailsModal if open */}
      {isSalesforceModalOpen && (
        <SalesforceDetailsModal details={salesforceDetails} onClose={closeModal} />
      )}
    </div>
  );
};

export default EmailView; 