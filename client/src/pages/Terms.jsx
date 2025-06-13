import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="bg-white text-gray-800 min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-blue-700">Terms and Conditions</h1>
        <p className="text-sm text-gray-500">Last Updated: June 13, 2025</p>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">1. Acceptance of Terms</h2>
          <p>
            By registering for an account or using any part of CyberGenie, you agree to comply
            with and be legally bound by these Terms, our Privacy Policy, and any additional
            policies referenced herein.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">2. Eligibility</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Be at least 13 years old.</li>
            <li>Provide accurate and complete registration information.</li>
            <li>Be responsible for maintaining the confidentiality of your login credentials.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">3. Use of the Platform</h2>
          <p>
            You agree to use CyberGenie solely for educational, personal, or non-commercial purposes,
            and in a manner that complies with all applicable laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">4. Intellectual Property</h2>
          <p>
            All content on CyberGenie — including text, graphics, code, logos, tutorials, quizzes,
            videos, and badges — is the intellectual property of CyberGenie or its licensors.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">5. User-Generated Content</h2>
          <p>
            By submitting content, you grant CyberGenie a worldwide, royalty-free, non-exclusive
            license to use and display it, and confirm that it does not infringe on third-party rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">6. Accounts and Security</h2>
          <p>
            You are responsible for all activities that occur under your account. CyberGenie is not
            liable for any loss resulting from unauthorized access.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">7. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your access if you violate these Terms,
            or for any reason without notice.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">8. Disclaimer of Warranties</h2>
          <p>
            CyberGenie is provided “as is” and “as available.” We do not guarantee complete
            accuracy or uninterrupted availability of the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">9. Limitation of Liability</h2>
          <p>
            CyberGenie is not liable for any direct, indirect, incidental, or consequential
            damages from your use of the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">10. Modifications</h2>
          <p>
            We may update these Terms at any time. Continued use of the platform means you
            accept the changes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">11. Governing Law</h2>
          <p>
            These Terms are governed by the laws of India, without regard to conflict of law
            principles.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">12. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
            <br />
            <a href="mailto:support@cybergenie.in" className="text-blue-700 underline">
              support@cybergenie.in
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
