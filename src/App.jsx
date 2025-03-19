import React, { useState, useEffect } from "react";
import { FaHeart, FaArrowUp, FaComment } from "react-icons/fa";
import { IoMdSunny, IoMdMoon } from "react-icons/io";

const UNSPLASH_ACCESS_KEY = "2ZSJA_rguW94Eh9cyD1m_JzMpH7ySYWMixV8XqKSjzM";

const fetchUnsplashImages = async (count = 10) => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?count=${count}&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    const data = await response.json();
    return data.map((img) => img.urls.regular);
  } catch (error) {
    console.error("Error fetching images from Unsplash:", error);
    return [];
  }
};

const generateRandomPosts = async (count = 10, startId = 1) => {
  const users = ["Sara", "John", "Alice", "Michael", "Emma", "Liam"];
  const avatars = Array.from(
    { length: 50 },
    (_, i) => `https://randomuser.me/api/portraits/men/${i % 50}.jpg`
  );
  const tagsList = [["Travel", "Beach"]];

  const images = await fetchUnsplashImages(count);

  return Array.from({ length: count }, (_, index) => ({
    id: startId + index,
    user: users[Math.floor(Math.random() * users.length)],
    avatar: avatars[Math.floor(Math.random() * avatars.length)],
    date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    image: images[index] || "https://source.unsplash.com/400x300/?nature",
    text: `Post ${startId + index}`,
    tags: tagsList[Math.floor(Math.random() * tagsList.length)],
    likes: Math.floor(Math.random() * 100),
    comments: [],
  }));
};

const App = () => {
  const [posts, setPosts] = useState([]);
  const [theme, setTheme] = useState("light");
  const [showScroll, setShowScroll] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    const loadInitialPosts = async () => {
      const newPosts = await generateRandomPosts(10, 1);
      setPosts(newPosts);
    };
    loadInitialPosts();
  }, []);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const handleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleComment = (postId) => {
    if (!commentInputs[postId]) return;
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, commentInputs[postId]] }
          : post
      )
    );
    setCommentInputs({ ...commentInputs, [postId]: "" });
  };

  const loadMorePosts = async () => {
    const newPosts = await generateRandomPosts(10, posts.length + 1);
    setPosts((prevPosts) => [...prevPosts, ...newPosts]);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col items-center p-4 transition-all duration-300 ${theme === "dark" ? "bg-black text-white" : "bg-gray-100 text-black"}`}>
      <header className="fixed top-0 left-0 w-full flex justify-between items-center p-4 bg-purple-500 text-white shadow-md z-10">
        <h1 className="text-xl font-bold">Social Feed</h1>
        <button
  onClick={toggleTheme}
  className="p-2 rounded-full cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95"
>
  {theme === "light" ? <IoMdMoon size={20} /> : <IoMdSunny size={20} />}
</button>

      </header>

      <div className="w-full max-w-md mt-20">
        {posts.map((post) => (
          <div key={post.id} className={`p-4 rounded-lg shadow mb-4 transition-all duration-300 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
            <div className="flex items-center mb-2">
              <img src={post.avatar} alt="avatar" className="w-8 h-6 rounded-full mr-2" />
              <div>
                <p className="font-bold">{post.user}</p>
                <p className="text-sm opacity-70">{new Date(post.date).toLocaleString()}</p>
              </div>
            </div>
            <img src={post.image} alt="post" className="w-full rounded mb-2" />
            <div className="flex flex-wrap mt-2">
              {post.tags.map((tag, index) => (
                <span key={index} className={`text-sm px-2 py-1 rounded-full mr-2 mb-2 transition-all duration-300 ${theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"}`}>
                  #{tag}
                </span>
              ))}
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <button onClick={() => handleLike(post.id)} className="flex items-center text-red-400 hover:text-red-500 ">
                <FaHeart className="mr-1 cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95" /> {post.likes}
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={loadMorePosts} className="mt-4 px-4 py-2 bg-black text-white rounded-full hover:bg-purple-600 cursor-pointer">Load More</button>
      {showScroll && (
        <button onClick={scrollToTop} className="fixed bottom-4 right-4 p-3 bg-black text-white rounded-full shadow-lg hover:bg-purple-600 cursor-pointer">
          <FaArrowUp />
        </button>
      )}
    </div>
  );
};

export default App;