import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const API_TOKEN = process.env.NEXT_PUBLIC_HUGGING_FACE_API_TOKEN;

const ImageGenerationForm = () => {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const input = event.target.elements.input.value;

    if (!input) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_TOKEN}`,
          },
          body: JSON.stringify({ inputs: input }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const blob = await response.blob();
      setOutput(URL.createObjectURL(blob));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (output) {
      const link = document.createElement('a');
      link.href = output;
      link.download = 'ai_generated_image.png';
      link.click();
    }
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const PlaceholderChanger = () => {
    const originalTexts = useMemo(() => [
      'Android assassin on a rainy rooftop',
      'Playful cat in a field of flowers',
      'A lone wanderer searching for hope in a post-apocalyptic world',
      'Team of superheroes saving the world',
      'Peaceful lakeside surrounded by lush greenery',
      'Cozy cabin in snowy mountains',
      'Caped crusader protecting the city',
      'Vintage cafe in a bustling city',
      'Happy dogs wagging their tails',
      'Cool and confident swordsman with silver hair',
    ], []);

    const [texts, setTexts] = useState([]);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    useEffect(() => {
      setTexts(shuffleArray(originalTexts));
    }, [originalTexts]);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
      }, 10000);

      return () => clearInterval(interval);
    }, [texts]);

    return texts.length > 0 ? texts[currentTextIndex] : '';
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-sans"
      initial={{ opacity: 0, x: -240 }}
      animate={{ x: 0, opacity: 1, transition: { ease: 'easeInOut', duration: 1.5 } }}
    >
      <h1 className="text-4xl text-center md:text-6xl font-extrabold mb-4">Dress-Up</h1>
      <p className="text-center mb-8">Text-to-Image Generator</p>

      <form className="w-full max-w-lg" onSubmit={handleSubmit}>
        <div className="flex items-center border-b border-black py-2">
          <input
            type="text"
            name="input"
            placeholder={PlaceholderChanger()}
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="submit"
            className="flex-shrink-0 bg-gray-800 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
          >
            Create Image
          </motion.button>
        </div>
      </form>

      {loading && <div className="mt-4 text-center">Generating your image...</div>}

      {!loading && output && (
        <motion.div
          initial={{ opacity: 0, x: -240 }}
          animate={{ x: 0, opacity: 1, transition: { ease: 'linear', duration: 1.6 } }}
          className="mt-10 flex flex-col items-center"
        >
          <Image src={output} alt="Generated artwork" width={356} height={356} className="border border-gray-300" />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="mt-4 bg-gray-800 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
            onClick={handleDownload}
          >
            <svg className="w- h-2 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <span>Download</span>
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ImageGenerationForm;
