import "./App.css";
import { IoCodeSlash, IoSend } from "react-icons/io5";
import { BiPlanet } from "react-icons/bi";
import { FaPython } from "react-icons/fa";
import { TbMessageChatbot } from "react-icons/tb";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [message, setMessage] = useState("");
  const [isResponseScreen, setIsResponseScreen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isOtpScreen, setIsOtpScreen] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const hitRequest = () => {
    if (message) {
      // Step 1: Generate OTP
      const generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(generatedOTP);

      // Trigger Toastify with the generated OTP
      toast.success(`Your OTP is: ${generatedOTP}`, {
        // Step 2: Auto-fill OTP when the toast is clicked
        onClick: () => {
          setOtp(generatedOTP);
        },
      });
      setIsOtpScreen(true);
    } else {
      alert("You must write something!");
    }
  };

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      // Step 1: OTP verification success
      generateResponse(message);
      setIsOtpScreen(false); // Hide OTP screen after success
      setOtp(""); // Clear the OTP input after successful verification
    } else {
      // Step 2: OTP verification failure
      toast.error("Invalid OTP! Please try again.");
      setOtp(""); // Clear the OTP input after failure to let the user enter a new one
    }
  };

  const generateResponse = async (msg) => {
    if (!msg) return;

    // Check if the message is specifically related to Java and not JavaScript
    const javaKeywords = [
      "java",
      "java ",
      " java",
      "jvm",
      "java programming",
      "spring",
      "hibernate",
      "jdk",
    ];
    const isJavaRelated = javaKeywords.some(
      (keyword) =>
        msg.toLowerCase().includes(keyword) &&
        !msg.toLowerCase().includes("javascript")
    );

    if (isJavaRelated) {
      // If the message is related to Java, show the custom response
      const newMessages = [
        ...messages,
        { type: "userMsg", text: msg },
        {
          type: "responseMsg",
          text: "I will not answer Java-related questions",
        },
      ];
      setMessages(newMessages);
    } else {
      // Otherwise, proceed with generating the response using the API
      const genAI = new GoogleGenerativeAI(
        "AIzaSyDzeAAuT4jZliYECSuld5YgX1I5hXKm7Bk"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(msg);

      const newMessages = [
        ...messages,
        { type: "userMsg", text: msg },
        { type: "responseMsg", text: result.response.text() },
      ];

      setMessages(newMessages); // Append new messages to the existing ones
    }

    setIsResponseScreen(true);
    setMessage(""); // Clear the input field after sending the message
  };

  const newChat = () => {
    setIsResponseScreen(false);
    setMessages([]); // Clear the messages array
  };

  const cardData = [
    {
      id: 1,
      text: "What is coding? \n How we can learn it.",
      icon: <IoCodeSlash />,
    },
    {
      id: 2,
      text: "Which is the red \n planet of solar \n system?",
      icon: <BiPlanet />,
    },
    {
      id: 3,
      text: "In which year python \n was invented?",
      icon: <FaPython />,
    },
    {
      id: 4,
      text: "How we can use \n the AI for adopt?",
      icon: <TbMessageChatbot />,
    },
  ];

  const handleClick = (text) => {
    setMessage(text); // Set the message when the card is clicked
  };

  return (
    <>
      <ToastContainer /> {/* Toastify container */}
      <div className="container w-screen min-h-screen overflow-x-hidden bg-[#0E0E0E] text-white">
        {isResponseScreen ? (
          <div className="h-[80vh]">
            <div className="header pt-[25px] flex items-center justify-between w-full px-4 md:px-[300px]">
              <h2 className="text-xl md:text-2xl">My GPT</h2>
              <button
                id="newChatBtn"
                className="bg-[#181818] p-[8px] md:p-[10px] rounded-[30px] cursor-pointer text-[12px] md:text-[14px] px-[15px] md:px-[20px]"
                onClick={newChat}
              >
                New Chat
              </button>
            </div>

            <div className="messages md:max-2xl:px-4">
              {messages?.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${
                    msg.type === "userMsg" ? "user-message" : "response-message"
                  } relative p-4 bg-[#181818] rounded-lg mb-2`}
                >
                  {msg.type === "responseMsg" && (
                    <button
                      onClick={() => navigator.clipboard.writeText(msg.text)}
                      className="absolute top-2 right-2 text-white text-[12px] md:text-[14px] bg-[#0E0E0E] p-1 rounded-full cursor-pointer"
                    >
                      <i className="copy-icon">📋</i>{" "}
                      {/* Add a suitable icon here */}
                    </button>
                  )}
                  {msg.text}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="middle h-[80vh] flex items-center flex-col justify-center text-center px-4">
            <h1 className="text-3xl md:text-4xl">My GPT</h1>
            <div className="boxes mt-[30px] grid grid-cols-2 gap-2">
              {cardData.map((card) => (
                <div
                  key={card.id}
                  className="card rounded-lg cursor-pointer transition-all hover:bg-[#201f1f] px-[20px] relative min-h-[20vh] bg-[#181818] p-[10px]"
                  onClick={() => handleClick(card.text)}
                >
                  <p className="text-[18px] whitespace-pre-line">{card.text}</p>
                  <i className="absolute right-3 bottom-3 text-[18px]">
                    {card.icon}
                  </i>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OTP Screen */}
        {isOtpScreen && (
          <div className="otpScreen flex items-center justify-center">
            <div className="otpBox bg-[#181818] p-5 md:p-10 rounded-md">
              <h3 className="text-xl md:text-2xl mb-4">Enter OTP</h3>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="otpInput bg-[#0E0E0E] text-white p-2 md:p-3 rounded-md w-full mb-4"
                placeholder="Enter OTP"
              />
              <button
                className="bg-green-500 text-white p-2 md:p-3 rounded-md w-full"
                onClick={verifyOtp}
              >
                Verify OTP
              </button>
            </div>
          </div>
        )}

        <div className="bottom w-full flex flex-col items-center mt-5">
          <div className="inputBox w-[90%] md:w-[60%] text-[14px] md:text-[15px] py-[5px] md:py-[7px] flex items-center bg-[#181818] rounded-[30px]">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              className="p-[8px] md:p-[10px] pl-[15px] bg-transparent flex-1 outline-none border-none"
              placeholder="Write your message here..."
              id="messageBox"
            />
            {message === "" ? (
              ""
            ) : (
              <i
                className="text-green-500 text-[18px] md:text-[20px] mr-3 md:mr-5 cursor-pointer"
                onClick={hitRequest}
              >
                <IoSend />
              </i>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
