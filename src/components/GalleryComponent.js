import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import path from 'path';

export default function GalleryComponent({ category }) {
  const [projects, setProjects] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 推断图片类别
  function inferCategory(filename) {
    const categoryPatterns = [
      { regex: /^(Fashion|时尚)_/i, category: 'Fashion' },
      { regex: /^(Makeup|妆面)_/i, category: 'Makeup' },
      { regex: /^(Product|产品)_/i, category: 'Product' },
      { regex: /^(fashion|makeup|product|时尚|妆面|产品)/i, category: (match) => {
        const typeMap = {
          'fashion': 'Fashion',
          '时尚': 'Fashion',
          'makeup': 'Makeup',
          '妆面': 'Makeup',
          'product': 'Product',
          '产品': 'Product'
        };
        return typeMap[match[1].toLowerCase()];
      }}
    ];

    for (const pattern of categoryPatterns) {
      const match = filename.match(pattern.regex);
      if (match) {
        return typeof pattern.category === 'function' 
          ? pattern.category(match) 
          : pattern.category;
      }
    }

    return 'Other';
  }

  // 获取图片列表
  useEffect(() => {
    async function fetchImages() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/images');
        
        if (!response.ok) {
          throw new Error(`HTTP错误! 状态: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('获取的图片列表:', data.images);
        console.log('图片目录:', data.directory);
        
        if (data.images && data.images.length > 0) {
          setImageList(data.images);
          setError(null);
        } else {
          setError('没有找到任何图片');
        }
      } catch (error) {
        console.error('获取图片列表失败:', error);
        setError(error.message);
        setImageList([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchImages();
  }, []);

  // 根据类别过滤图片
  useEffect(() => {
    const processedProjects = imageList.map(filename => {
      // 推断图片类型
      const type = inferCategory(filename);

      console.log('处理图片:', filename, '类型:', type);

      return {
        id: filename,
        type: type,
        brand: '安妮的作品',
        photographer: '安妮',
        imageUrl: `/images/${encodeURIComponent(filename)}`, // 对文件名进行编码
        tags: []
      };
    });

    const filteredProjects = category === 'All' 
      ? processedProjects 
      : processedProjects.filter(project => project.type === category);

    console.log('过滤后的项目:', filteredProjects);
    setProjects(filteredProjects);
  }, [imageList, category]);

  // 关闭大图模态框
  const closeModal = () => {
    setSelectedImage(null);
  };

  // 渲染加载状态
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // 渲染错误状态
  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        <p>加载图片时发生错误：{error}</p>
        <p>请检查图片目录和网络连接</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      {projects.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          {category === 'All' 
            ? '暂无作品，请上传图片' 
            : `暂无${category}类别的作品`}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-content-center place-items-center">
          {projects.map(project => (
            <div 
              key={project.id} 
              className="flex flex-col items-center justify-center w-full max-w-[400px]"
              onClick={() => setSelectedImage(project)}
            >
              <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg shadow-lg cursor-pointer">
                <Image
                  src={project.imageUrl}
                  alt={`${project.type} 项目 - ${project.brand}`}
                  fill
                  unoptimized
                  priority={false}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    console.error('图片加载错误:', project.imageUrl, e);
                    e.target.src = '/placeholder.jpg'; // 添加一个占位图
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 opacity-0 hover:opacity-100 transition-opacity duration-300 text-center">
                  <p className="text-sm font-semibold">{project.brand}</p>
                  <p className="text-xs">{project.photographer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 大图模态框 */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-[90vw] max-h-[90vh] aspect-[2/3] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage.imageUrl}
              alt={`${selectedImage.type} 项目 - ${selectedImage.brand}`}
              fill
              unoptimized
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 90vw"
              className="object-contain"
              onError={(e) => {
                console.error('大图加载错误:', selectedImage.imageUrl, e);
                e.target.src = '/placeholder.jpg'; // 添加一个占位图
              }}
            />
            <button 
              onClick={closeModal}
              className="absolute top-2 right-2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 text-black"
            >
              ✕
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 text-center">
              <p className="text-sm font-semibold">{selectedImage.brand}</p>
              <p className="text-xs">{selectedImage.photographer}</p>
              <p className="text-xs">{selectedImage.type} 类别</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
