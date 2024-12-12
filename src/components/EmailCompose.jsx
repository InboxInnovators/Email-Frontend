import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/all';
// Register the Draggable plugin
gsap.registerPlugin(Draggable);

const EmailCompose = ({ onClose }) => {
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    body: ''
  });
  
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement email sending logic
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFields = () => {
    setEmailData({
      to: '',
      subject: '',
      body: ''
    });
  };

  return (
    <div 
      ref={modalRef}
      className="fixed bottom-0 right-0 w-[500px] h-[600px] bg-white shadow-design rounded-t-xl"
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
      
      <form onSubmit={handleSubmit} className="p-6 flex flex-col h-[calc(100%-64px)]">
        <input
          type="email"
          name="to"
          placeholder="To"
          value={emailData.to}
          onChange={handleChange}
          className="mb-4 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                   focus:border-navy-400 focus:outline-none transition-colors"
          required
        />
        
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={emailData.subject}
          onChange={handleChange}
          className="mb-4 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                   focus:border-navy-400 focus:outline-none transition-colors"
        />
        
        <textarea
          name="body"
          placeholder="Write your message here..."
          value={emailData.body}
          onChange={handleChange}
          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                   focus:border-navy-400 focus:outline-none transition-colors resize-none"
          required
        />
        
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-navy-500 text-white rounded-xl hover:bg-navy-600 
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