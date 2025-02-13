import React, { useState } from 'react';
import Head from 'next/head';
import GalleryComponent from '../components/GalleryComponent';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Fashion', 'Makeup', 'Product'];

  return (
    <div className="min-h-screen bg-white text-black">
      <Head>
        <title>安妮 - 模特作品集</title>
        <meta name="description" content="安妮的专业模特作品展示" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-12 space-y-4">
          <div className="flex flex-col items-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-2">
              安妮
            </h1>
            <p className="text-xl text-gray-600 font-light">
              Professional Model | Creative Storyteller
            </p>
          </div>
          
          <nav className="flex justify-center space-x-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === category 
                    ? 'bg-black text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </nav>
        </header>

        <GalleryComponent category={selectedCategory} />
      </main>
    </div>
  );
}
