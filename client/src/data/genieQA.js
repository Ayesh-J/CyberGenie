const genieQA = [
  {
    id: "start",
    question: "Hey 😁 I am CyberGenie. What can I help you with today?",
    options: [
      "I clicked a suspicious link",
      "My account is hacked",
      "I received a suspicious call",
      "I got a phishing email",
      "My device is behaving weirdly",
      "My problem isn't listed",
    ],
  },
  {
    id: "I clicked a suspicious link",
    question: "Got it. Did you enter any login info, download anything, or did nothing happen?",
    options: ["I entered login info", "A file got downloaded", "Nothing happened"],
  },
  {
    id: "I entered login info",
    answer: "Change all passwords immediately and enable two-factor authentication (2FA). Monitor your accounts for suspicious activity.",
    followUp: "Would you like help securing your accounts or setting up 2FA?",
    options: ["Yes, help with 2FA", "No, I can manage", "End chat"],
  },
  {
    id: "Yes, help with 2FA",
    answer: "Go to your account's security settings → Enable 2FA → Choose SMS or an authenticator app. Repeat for each important account.",
    followUp: "All set? Or do you want a checklist to cover all bases?",
    options: ["Yes, give me a checklist", "No thanks, I'm done", "End chat"],
  },
  {
    id: "Yes, give me a checklist",
    answer: "✔ Change all passwords\n✔ Enable 2FA\n✔ Monitor recent activity\n✔ Scan device for malware\n✔ Avoid using same passwords across sites",
    options: ["End chat"],
  },
  {
    id: "A file got downloaded",
    answer: "Delete the file if it's still there. Disconnect from the internet and run a full antivirus scan.",
    followUp: "Do you have antivirus software installed?",
    options: ["Yes", "No", "I don't know", "End chat"],
  },
  {
    id: "No",
    answer: "I recommend installing a trusted antivirus immediately. You can try Bitdefender, Kaspersky, or Malwarebytes.",
    options: ["End chat"],
  },
  {
    id: "I don't know",
    answer: "Check your installed programs for any security software. If unsure, better to install one to be safe.",
    options: ["End chat"],
  },
  {
    id: "Nothing happened",
    answer: "That's a relief! Still, clear your browser cache and monitor your accounts for a few days.",
    followUp: "Would you like tips on safe browsing?",
    options: ["Yes, please", "No, I'm good", "End chat"],
  },
  {
    id: "Yes, please",
    answer: "✅ Avoid clicking unknown links\n✅ Always verify URLs\n✅ Use browser extensions like HTTPS Everywhere or uBlock Origin",
    options: ["End chat"],
  },
  {
    id: "My account is hacked",
    question: "Oh no! Which type of account is affected?",
    options: ["Email account", "Social media account", "Bank account"],
  },
  {
    id: "Email account",
    answer: "Contact your email provider’s support, reset your password, and review recovery settings.",
    followUp: "Have you regained access to the account?",
    options: ["Yes", "Still trying", "Not yet", "End chat"],
  },
  {
    id: "Still trying",
    answer: "You can recover it through 'Forgot Password'. If that fails, contact support directly with identity proof.",
    options: ["End chat"],
  },
  {
    id: "Social media account",
    answer: "Report your hacked account to the platform, reset the password, and notify your contacts.",
    followUp: "Did the attacker post anything from your profile?",
    options: ["Yes", "No", "Not sure", "End chat"],
  },
  {
    id: "Yes",
    answer: "Delete any suspicious posts and inform your friends not to click on anything strange.",
    options: ["End chat"],
  },
  {
    id: "Bank account",
    answer: "Contact your bank immediately to freeze the account. Monitor for unauthorized transactions and report to cybercrime helpline.",
    followUp: "Would you like emergency numbers or links?",
    options: ["Yes, please", "No, it's handled", "End chat"],
  },
  {
    id: "I received a suspicious call",
    question: "What did they ask you for?",
    options: ["They asked for an OTP", "They asked for money", "They claimed to be tech support"],
  },
  {
    id: "They asked for an OTP",
    answer: "Never share OTPs. Secure your accounts and monitor for unauthorized access.",
    options: ["End chat"],
  },
  {
    id: "They asked for money",
    answer: "It’s likely a scam. Block the number and report the incident to local cybercrime authorities.",
    options: ["End chat"],
  },
  {
    id: "They claimed to be tech support",
    answer: "Hang up immediately. Real tech support will never cold-call you. Run an antivirus scan if you followed their instructions.",
    followUp: "Did you give them remote access?",
    options: ["Yes", "No", "End chat"],
  },
  {
    id: "I got a phishing email",
    question: "Have you reported it?",
    options: ["Yes, I reported it", "No, not yet", "Not sure what to do"],
  },
  {
    id: "Not sure what to do",
    answer: "Don’t worry. Forward the email to your provider’s abuse team or report it at cybercrime.gov.in.",
    options: ["End chat"],
  },
  {
    id: "My device is behaving weirdly",
    question: "What kind of issue are you facing?",
    options: ["Pop-ups and ads", "Very slow performance", "Unknown apps installed"],
  },
  {
    id: "Pop-ups and ads",
    answer: "You may have adware. Install and run a trusted anti-malware tool to clean your system.",
    followUp: "Do you want me to recommend one?",
    options: ["Yes", "No", "End chat"],
  },
  {
    id: "Very slow performance",
    answer: "Could be malware or system overload. Run a virus scan and check for unnecessary startup programs.",
    options: ["End chat"],
  },
  {
    id: "Unknown apps installed",
    answer: "Uninstall any unknown apps and scan your system for malware immediately.",
    followUp: "Are any of those apps still running in the background?",
    options: ["Yes", "No", "Not sure", "End chat"],
  },
  {
    id: "My problem isn't listed",
    answer: "No worries! You can contact the Cybercrime Helpline:\n\n📞 National Cyber Helpline: 1930\n🌐 cybercrime.gov.in",
    options: ["End chat"],
  },
  {
    id: "No, I'm good",
    answer: "Alright. If you ever need help again, I'm here for you. Stay safe online! 👋",
  },
  {
    id: "No thanks, I'm done",
    answer: "Glad I could help! Wishing you safe and secure browsing ahead! 🧠🔐",
  },
  {
    id: "End chat",
    answer: "Thank you for using CyberGenie. Stay safe out there! 🛡️",
  },
];

export default genieQA;
