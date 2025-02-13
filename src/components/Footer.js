import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-4 px-2 mt-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
        {/* 版权信息 */}
        <div className="text-center md:text-left text-sm">
          <p>&copy; {currentYear} Anny Model Portfolio. All Rights Reserved.</p>
        </div>

        {/* 社交媒体链接 */}
        <div className="flex space-x-3 text-sm">
          <Link href="https://instagram.com" target="_blank" className="hover:text-gray-300">
            Instagram
          </Link>
          <Link href="https://twitter.com" target="_blank" className="hover:text-gray-300">
            Twitter
          </Link>
          <Link href="https://linkedin.com" target="_blank" className="hover:text-gray-300">
            LinkedIn
          </Link>
        </div>

        {/* 快速链接 */}
        <div className="flex space-x-3 text-sm">
          <Link href="/privacy" className="hover:underline">隐私政策</Link>
          <Link href="/terms" className="hover:underline">使用条款</Link>
          <Link href="/contact" className="hover:underline">联系我们</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
