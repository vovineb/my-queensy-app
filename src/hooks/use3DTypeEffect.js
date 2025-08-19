import { useState, useEffect } from 'react';

export const use3DTypeEffect = (phrases, typeSpeed = 100, deleteSpeed = 50, pauseTime = 2000) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    
    if (isDeleting) {
      if (currentText === '') {
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        return;
      }
      
      const timeout = setTimeout(() => {
        setCurrentText(currentText.slice(0, -1));
      }, deleteSpeed);
      
      return () => clearTimeout(timeout);
    } else {
      if (currentText === currentPhrase) {
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
        
        return () => clearTimeout(timeout);
      }
      
      const timeout = setTimeout(() => {
        setCurrentText(currentPhrase.slice(0, currentText.length + 1));
      }, typeSpeed);
      
      return () => clearTimeout(timeout);
    }
  }, [currentText, isDeleting, currentPhraseIndex, phrases, typeSpeed, deleteSpeed, pauseTime]);

  return currentText;
};

