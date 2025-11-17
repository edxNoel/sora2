import React, { useCallback, useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const FlipWords = ({
  words,
  duration = 3000,
  className,
}) => {
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const measureRef = useRef(null);
  const wordWidthsRef = useRef({});
  const [maxWidth, setMaxWidth] = useState(0);
  const [currentWidth, setCurrentWidth] = useState(0);

  // Calculate maximum width needed for all words
  useEffect(() => {
    // Wait for component to mount and styles to be computed
    const timer = setTimeout(() => {
      if (measureRef.current && words.length > 0) {
        const computedStyle = window.getComputedStyle(measureRef.current);
        const widths = words.map(word => {
          const span = document.createElement('span');
          span.style.visibility = 'hidden';
          span.style.position = 'absolute';
          span.style.whiteSpace = 'nowrap';
          span.style.fontSize = computedStyle.fontSize;
          span.style.fontFamily = computedStyle.fontFamily;
          span.style.fontWeight = computedStyle.fontWeight;
          span.style.letterSpacing = computedStyle.letterSpacing;
          span.textContent = word;
          document.body.appendChild(span);
          const width = span.offsetWidth;
          document.body.removeChild(span);
          // Store width for each word
          wordWidthsRef.current[word] = width;
          return width;
        });
        setMaxWidth(Math.max(...widths) + 16); // Add padding
        
        // Set initial current word width
        if (wordWidthsRef.current[currentWord]) {
          setCurrentWidth(wordWidthsRef.current[currentWord]);
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [words]);

  // Update current width when word changes
  useEffect(() => {
    if (wordWidthsRef.current[currentWord]) {
      setCurrentWidth(wordWidthsRef.current[currentWord]);
    }
  }, [currentWord]);

  // thanks for the fix Julian - https://github.com/Julian-AT
  const startAnimation = useCallback(() => {
    const word = words[words.indexOf(currentWord) + 1] || words[0];
    setCurrentWord(word);
    setIsAnimating(true);
  }, [currentWord, words]);

  useEffect(() => {
    if (!isAnimating)
      setTimeout(() => {
        startAnimation();
      }, duration);
  }, [isAnimating, duration, startAnimation]);

  // Calculate if we should center the current word
  const shouldCenter = maxWidth > 0 && currentWidth > 0 && currentWidth < maxWidth - 16;
  const leftOffset = shouldCenter ? (maxWidth - currentWidth) / 2 : 0;

  return (
    <span 
      ref={measureRef}
      className="inline-block relative"
      style={{
        minWidth: maxWidth > 0 ? `${maxWidth}px` : 'auto',
        verticalAlign: 'baseline',
        textAlign: 'left'
      }}
    >
      <AnimatePresence
        onExitComplete={() => {
          setIsAnimating(false);
        }}
      >
        <motion.span
          initial={{
            opacity: 0,
            y: 10,
            x: 0,
          }}
          animate={{
            opacity: 1,
            y: 0,
            x: leftOffset,
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
          }}
          exit={{
            opacity: 0,
            y: -40,
            x: 40,
            filter: "blur(8px)",
            scale: 2,
            position: "absolute",
          }}
          className={cn(
            "z-10 inline-block relative px-2",
            className
          )}
          style={{
            verticalAlign: 'baseline',
            whiteSpace: 'nowrap',
            display: 'inline-block'
          }}
          key={currentWord}
        >
        {/* edit suggested by Sajal: https://x.com/DewanganSajal */}
        {currentWord.split(" ").map((word, wordIndex) => (
          <motion.span
            key={word + wordIndex}
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              delay: wordIndex * 0.3,
              duration: 0.3,
            }}
            className="inline-block whitespace-nowrap"
          >
            {word.split("").map((letter, letterIndex) => (
              <motion.span
                key={word + letterIndex}
                initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  delay: wordIndex * 0.3 + letterIndex * 0.05,
                  duration: 0.2,
                }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
            <span className="inline-block">&nbsp;</span>
          </motion.span>
        ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

