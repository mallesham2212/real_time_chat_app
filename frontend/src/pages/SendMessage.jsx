import React, { useState, useRef } from "react";
import { useChatStore } from "../utils/useChatStore";
import { Send, Image } from "lucide-react";

const SendMessage = () => {
  const { selectedUser, sendMessage } = useChatStore();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();
  const inputRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;
    setLoading(true);
    try {
      await sendMessage({ text: text.trim(), image });
      setText("");
      setImage(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      inputRef.current?.focus();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gray-50 border-t px-3 py-2 sm:px-4 sticky bottom-0 flex-shrink-0">
      {preview && (
        <div className="flex items-center justify-between bg-white p-2 border rounded-md mb-2">
          <img src={preview} alt="preview" className="w-16 h-16 object-cover rounded-md" />
          <button onClick={removeImage} className="text-red-500 text-xs hover:underline">Remove</button>
        </div>
      )}
      <form onSubmit={handleSend} className="flex items-center gap-2 sm:gap-3">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-white border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <label className="cursor-pointer p-2 rounded-full hover:bg-gray-200 transition">
          <Image className="w-5 h-5 text-gray-600" />
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
        </label>
        <button type="submit" disabled={loading} className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition disabled:opacity-50">
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default SendMessage;
