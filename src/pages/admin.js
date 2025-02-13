import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function AdminPage() {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState('Fashion');
  const [uploadStatus, setUploadStatus] = useState('');
  const router = useRouter();

  // 获取当前已上传的图片
  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch('/api/images');
        if (response.ok) {
          const data = await response.json();
          setImages(data.images);
        } else {
          console.error('获取图片列表失败:', response.status);
        }
      } catch (error) {
        console.error('获取图片列表错误:', error);
      }
    }
    fetchImages();
  }, []);

  // 处理文件选择
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('选择的文件:', file);
      setSelectedFile(file);
    }
  };

  // 上传图片
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('请先选择文件');
      return;
    }

    try {
      // 对文件名进行编码处理
      const encodedFileName = encodeURIComponent(selectedFile.name);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'x-file-name': encodedFileName,
          'x-file-category': category
        },
        body: await selectedFile.arrayBuffer()
      });

      const result = await response.json();

      if (response.ok) {
        console.log('上传成功:', result);
        setUploadStatus(`上传成功: ${result.filename}`);
        setSelectedFile(null);
        // 重置文件输入
        const fileInput = document.getElementById('fileInput');
        if (fileInput) fileInput.value = '';
        // 刷新图片列表
        const updatedResponse = await fetch('/api/images');
        const updatedData = await updatedResponse.json();
        setImages(updatedData.images);
      } else {
        console.error('上传失败:', result);
        setUploadStatus(`上传失败: ${result.error}`);
      }
    } catch (error) {
      console.error('上传错误:', error);
      setUploadStatus(`上传错误: ${error.message}`);
    }
  };

  // 删除图片
  const handleDelete = async (filename) => {
    try {
      const response = await fetch(`/api/upload?filename=${filename}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        console.log('删除成功:', filename);
        // 更新图片列表
        const updatedResponse = await fetch('/api/images');
        const updatedData = await updatedResponse.json();
        setImages(updatedData.images);
      } else {
        const result = await response.json();
        console.error('删除失败:', result);
        alert(`删除失败: ${result.error}`);
      }
    } catch (error) {
      console.error('删除错误:', error);
      alert('删除出现错误');
    }
  };

  // 处理退出登录
  const handleLogout = () => {
    // 清除本地存储的登录状态
    localStorage.removeItem('isAdmin');
    
    // 跳转到登录页面
    router.push('/login');
  };

  // 检查是否已登录（简单的登录保护）
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
      router.push('/login');
    }
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">图片管理</h1>

      {/* 退出登录按钮 */}
      <button 
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out mb-6"
      >
        退出登录
      </button>

      {/* 上传区域 */}
      <div className="mb-6 p-4 border rounded-lg">
        <div className="flex items-center space-x-4">
          <input 
            type="file" 
            id="fileInput"
            accept="image/*" 
            onChange={handleFileSelect} 
            className="file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
          
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="Fashion">时尚</option>
            <option value="Makeup">妆面</option>
            <option value="Product">产品</option>
          </select>

          <button 
            onClick={handleUpload}
            disabled={!selectedFile}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            上传
          </button>
        </div>
      </div>

      {uploadStatus && (
        <div className={`mt-4 p-2 rounded ${
          uploadStatus.includes('成功') 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {uploadStatus}
        </div>
      )}

      {/* 图片展示区域 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image} className="relative group">
            <Image 
              src={`/images/${image}`} 
              alt="uploaded image" 
              width={300} 
              height={450}
              className="w-full h-auto object-cover rounded-lg"
            />
            <button 
              onClick={() => handleDelete(image)}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              删除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
