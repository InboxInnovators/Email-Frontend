import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/all';
import axios from 'axios';
import useStore from '../useStore';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

// Register the Draggable plugin
gsap.registerPlugin(Draggable);

const EmailCompose = ({ onClose, to, content }) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState(content || ''); // Use content if provided
  const [isComposing, setIsComposing] = useState(false); // State to track AI composition
  const accessToken = useStore((state) => state.accessToken); // Get access token from Zustand store

  const modalRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    // Initialize draggable
    const draggable = Draggable.create(modalRef.current, {
      type: 'x,y',
      trigger: headerRef.current,
      bounds: window,
      edgeResistance: 0.65,
      inertia: true,
      onDrag: () => {
        // Optional: Add any drag effects here
        gsap.to(modalRef.current, {
          duration: 0.2,
          ease: "power1.out"
        });
      },
      onDragEnd: () => {
        // Optional: Reset scale when dragging ends
        gsap.to(modalRef.current, {
          scale: 1,
          duration: 0.2,
          ease: "power1.out"
        });
      }
    })[0];

    // Cleanup
    return () => {
      draggable.kill();
    };
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!body.trim()) {
      toast.error('Email body cannot be empty.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/sendEmail', {
        accessToken,
        subject,
        body,
        recipients: [to]
      });

      console.log(response.data.message);
      clearFields();
      onClose();
    } catch (error) {
      console.error("Error sending email:", error.response ? error.response.data : error.message);
      toast.error("Error Sending Email");
    }
  };

  const handleAiCompose = async () => {
    if (!body.trim()) {
      toast.error('Email body cannot be empty.');
      return;
    }

    setIsComposing(true);
    setBody('Generating...'); // Set initial body text immediately
    try {
      const response = await fetch('http://localhost:5000/api/compose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken,
          subject,
          body, // Use the current body for AI composition
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate email using AI');
      }

      // Read the stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value, { stream: true });
        setBody((prev) => prev + chunk); // Append the chunk to the body
      }
    } catch (error) {
      console.error('Error generating email using AI:', error);
      toast.error('Error generating email using AI.');
    } finally {
      setIsComposing(false);
    }
  };

  const clearFields = () => {
    setSubject('');
    setBody('');
  };

  return (
    <div 
      ref={modalRef}
      className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-white shadow-design rounded-t-xl max-w-md sm:max-w-xs lg:max-w-4xl w-full mx-auto"
    >
      <div 
        ref={headerRef}
        className="p-4 bg-[#0f4f97] rounded-t-xl flex justify-between items-center cursor-move"
      >
        <h2 className="text-lg font-medium text-white select-none">New Message</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={clearFields}
            className="text-sm px-3 py-1.5 bg-navy-600 text-white rounded-lg hover:bg-navy-500 
                     transition-colors duration-200"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            ×
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSend} className="p-6 flex flex-col h-[calc(100%-64px)]">
        <input
          type="email"
          name="to"
          placeholder="To"
          value={to}
          readOnly
          className="mb-4 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                   focus:border-navy-400 focus:outline-none transition-colors"
          required
        />
        
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mb-4 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                   focus:border-navy-400 focus:outline-none transition-colors"
        />
        
        <textarea
          name="body"
          placeholder="Write your message here..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                   focus:border-navy-400 focus:outline-none transition-colors resize-none"
          required
        />
        
        <div className="flex justify-between items-center mt-4">
          <button 
            type="button" 
            onClick={handleAiCompose} 
            className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            disabled={isComposing} // Disable button while composing
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              <Sparkles className="h-4 w-4 mr-2" />
              {isComposing ? 'Composing...' : 'Compose with AI'}
            </span>
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-[#0F4F97] text-white rounded-xl hover:bg-navy-600 
                     active:bg-navy-700 transition-colors duration-200"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailCompose; 