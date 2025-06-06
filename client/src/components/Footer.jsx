import React from "react";

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
            <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
            <li><a href="/learn" className="hover:underline">LearnZone</a></li>
            <li><a href="/quiz" className="hover:underline">QuizTime</a></li>
          </ul>
        </div>

        {/* Support / Contact */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Support</h3>
          <ul className="space-y-2">
            <li><a href="/faq" className="hover:underline">FAQ</a></li>
            <li><a href="https://www.instagram.com/ayesh_commits?igsh=MXcxdGdkaDFndmhieA==" className="text-white">@ayesh_commits</a></li>
            <li><a href="" className="text-white">LinkedIn</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Legal</h3>
          <ul className="space-y-2">
            <li><a href="/terms" className="hover:underline">Terms of Use</a></li>
            <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="border-t border-white border-opacity-10 mt-10 pt-6 text-center text-xs text-gray-300">
        © {new Date().getFullYear()} CyberGenie — All rights reserved. | Made by <a href="https://www.instagram.com/ayesh_commits?igsh=MXcxdGdkaDFndmhieA==" className="text-white">@ayesh_commits</a>
      </div>
    </footer>
  );
};

export default Footer;
