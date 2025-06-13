import { BotMessageSquare, GraduationCap, BookOpenCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // ✅ Import Link

function Home() {
  return (
    <div className="bg-gray-50 text-gray-800">

      {/* Hero Section */}
      <motion.section
        className="bg-white py-16 px-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-blue-600">Welcome to CyberGenie</h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600">
          Your Cyber Safety Companion – Learn how to stay safe online.
        </p>
        <div id="btn" className="flex justify-center items-center gap-4">
          <Link
            to="/learn"
            className="mt-6 inline-block bg-gradient-to-r from-blue-600 to-purple-500 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300"
          >
            Start Learning
          </Link>
        </div>
      </motion.section>

      {/* Features */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-12">Core Features</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {[{
            title: "Learn Zone", icon: <GraduationCap />, color: "text-blue-500", desc: "Simple explanations for complex cyber topics with real-world examples.", link: "/learn"
          }, {
            title: "Quiz Time", icon: <BookOpenCheck />, color: "text-purple-500", desc: "Test your cyber knowledge with fun, interactive quizzes.", link: "/quiz"
          }, {
            title: "Chatbot Help", icon: <BotMessageSquare />, color: "text-green-500", desc: "Get instant guidance on what to do if you've encountered suspicious activity.", link: "/chatbot"
          }].map((feature, idx) => (
            <motion.div
              key={idx}
              className="bg-white p-6 shadow rounded-lg hover:shadow-xl transition"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
            >
              <Link to={feature.link}>
                <h3 className={`text-xl font-bold mb-2 ${feature.color} flex justify-center items-center gap-2`}>
                  {feature.icon} {feature.title}
                </h3>
                <p>{feature.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16 px-6">
        <h2 className="text-3xl font-semibold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6 text-center max-w-6xl mx-auto">
          {[
            ["1. Choose a Topic", "Explore topics like scams, phishing, passwords, etc."],
            ["2. Learn Safely", "Read short lessons or watch quick videos."],
            ["3. Test Yourself", "Take quizzes and earn badges."],
            ["4. Get Guidance", "Use our chatbot if you face a real-world cyber issue."]
          ].map(([title, desc], idx) => (
            <motion.div
              key={idx}
              className="p-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <h4 className="text-lg font-semibold text-blue-600">{title}</h4>
              <p className="text-gray-600 mt-2">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <motion.section
        className="bg-gradient-to-br from-blue-500 to-purple-700 text-white py-16 text-center px-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold">Ready to Become Cyber Smart?</h2>
        <p className="mt-4 text-lg">Start your learning journey with CyberGenie today!</p>
        <Link
          to="/learn"
          className="mt-6 inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-gray-100 hover:scale-105 hover:shadow-lg transition-transform duration-300"
        >
          Explore Learn Zone
        </Link>
      </motion.section>

    </div>
  );
}

export default Home;
