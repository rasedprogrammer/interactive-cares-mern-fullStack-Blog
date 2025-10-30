// blog-application/frontend/src/components/SanitizedContent.jsx
'use client';

<<<<<<< HEAD
import DOMPurify from 'dompurify';
import React from 'react';

const SanitizedContent = ({ htmlContent, className }) => {
    const cleanHtml = DOMPurify.sanitize(htmlContent);
=======
import React from 'react';
import * as DOMPurifyModule from 'dompurify'; 


const DOMPurify = DOMPurifyModule.default || DOMPurifyModule;

const SanitizedContent = ({ htmlContent, className }) => {
     const sanitizer = typeof window !== 'undefined' ? DOMPurify : { sanitize: (html) => html };
    const cleanHtml = sanitizer.sanitize(htmlContent);
>>>>>>> 6f42eb0e80347aacea666ba624841bb26b06cb86

    // ... (existing empty content check) ...
    const plainText = cleanHtml.replace(/<[^>]*>/g, ''); 
    if (!plainText || plainText.trim().length === 0) {
        return null; 
    }

    // FIX: Only use the passed-in className
    const finalClassName = className || ''; // Do NOT add 'prose' here

    return (
        <div 
            className={finalClassName} // <-- ONLY APPLY CUSTOM CLASS HERE
            dangerouslySetInnerHTML={{ __html: cleanHtml }} 
        />
    );
};

export default SanitizedContent;