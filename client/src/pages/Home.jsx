
import { BotMessageSquare, GraduationCap, BookOpenCheck  } from "lucide-react";

function Home() {
  return (
    <div className="bg-gray-50 text-gray-800">

      {/* Hero Section */}
      <section className="bg-white py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-600">Welcome to CyberGenie</h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600">
          Your Cyber Safety Companion – Learn how to stay safe online.
        </p>
       <div id="btn" className="flex justify-center items-center gap-4">
         <a
          href="/learn"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-full border-1 hover:bg-white hover:text-blue-600 transition"
        >
          Start Learning
        </a>
       
       </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-12">Core Features</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-xl font-bold mb-2 text-blue-500 "><GraduationCap/> Learn Zone</h3>
            <p>Simple explanations for complex cyber topics with real-world examples.</p>
          </div>
          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-xl font-bold mb-2 text-purple-500 "><BookOpenCheck/> Quiz Time</h3>
            <p>Test your cyber knowledge with fun, interactive quizzes.</p>
          </div>
          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-xl font-bold mb-2 text-green-500 "><BotMessageSquare/> Chatbot Help</h3>
            <p>Get instant guidance on what to do if you've encountered suspicious activity.</p>
          </div>
           {/* <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-xl font-bold mb-2 text-green-500"> 📈 Dashboard</h3>
            <p>Track your progress and earn Badges</p>
          </div> */}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16 px-6">
        <h2 className="text-3xl font-semibold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6 text-center max-w-6xl mx-auto">
          <div className="p-4">
            <h4 className="text-lg font-semibold text-blue-600">1. Choose a Topic</h4>
            <p className="text-gray-600 mt-2">Explore topics like scams, phishing, passwords, etc.</p>
          </div>
          <div className="p-4">
            <h4 className="text-lg font-semibold text-blue-600">2. Learn Safely</h4>
            <p className="text-gray-600 mt-2">Read short lessons or watch quick videos.</p>
          </div>
          <div className="p-4">
            <h4 className="text-lg font-semibold text-blue-600">3. Test Yourself</h4>
            <p className="text-gray-600 mt-2">Take quizzes and earn badges.</p>
          </div>
          <div className="p-4">
            <h4 className="text-lg font-semibold text-blue-600">4. Get Guidance</h4>
            <p className="text-gray-600 mt-2">Use our chatbot if you face a real-world cyber issue.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-blue-500 to-purple-700 text-white py-16 text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold">Ready to Become Cyber Smart?</h2>
        <p className="mt-4 text-lg">Start your learning journey with CyberGenie today!</p>
        <a
          href="/learn"
          className="mt-6 inline-block bg-white text-blue-600 px-6 py-3 rounded-full hover:bg-gray-100 transition"
        >
          Explore Learn Zone
        </a>
      </section>

     </div>

  );
}
export default Home;
