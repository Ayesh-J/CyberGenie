import React from "react";
import { Link } from "react-router-dom";  

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-900 via-purple-800 to-blue-900 text-white py-10 px-6 shadow-inner">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        {/* Logo + Brief */}
        <div className="col-span-1">
          <h2 className="text-2xl font-bold text-white mb-2">CyberGenie</h2>
          <p className="opacity-80">
            Learn. Defend. Thrive. Empowering users with real-world CyberSafety
            knowledge through interactive and accessible content.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
            <li><Link to="/learn" className="hover:underline">LearnZone</Link></li>
            <li><Link to="/quiz" className="hover:underline">QuizTime</Link></li>
            <li><Link to="/admin" className="hover:underline">CMS</Link></li>
            <li>
              <a 
                href="https://www.flaticon.com/free-icons/reward" 
                title="reward icons" 
                className="hover:underline"
                target="_blank" 
                rel="noopener noreferrer"
              >
                Reward icons created by Flat Icons - Flaticon
              </a>
            </li>
          </ul>
        </div>

        {/* Support / Contact */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Support</h3>
          <ul className="space-y-2">
            <li><Link to="/faq" className="hover:underline">FAQ</Link></li>
            <li><a href="" className="text-white" target="_blank" rel="noopener noreferrer">support@cybergenie.in</a></li>
            <li><a href="https://www.linkedin.com/in/ayesh-jamadar-2676172a4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="text-white" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Legal</h3>
          <ul className="space-y-2">
            <li><Link to="/terms" className="hover:underline">Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="border-t border-white border-opacity-10 mt-10 pt-6 text-center text-xs text-gray-300">
        © {new Date().getFullYear()} CyberGenie — All rights reserved. | Made by{" "}
        <a href="" className="text-white" target="_blank" rel="noopener noreferrer">support@cybergenie.in</a>
      </div>
    </footer>
  );
};

export default Footer;
