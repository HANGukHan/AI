"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

// Pre-populated default greetings to make the guestbook feel alive immediately.
const DEFAULT_GREETINGS = [
  {
    id: "default-1",
    name: "김민우",
    message: "안녕하세요! 인사말 하나에 담긴 정성 어린 뜻을 되짚어보는 계기가 되었네요. 정말 아름다운 공간입니다. 🌸",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "default-2",
    name: "Sarah Jenkins",
    message: "Annyeonghaseyo! The bowing visualizer is so cool and helpful. Love the sleek UI! ✨",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
  },
  {
    id: "default-3",
    name: "이지연",
    message: "다들 평온한 하루 보내고 계시기를 바랍니다. 오늘 하루도 안녕히! 🍀",
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
  },
];

export default function Guestbook() {
  const [greetings, setGreetings] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [storageType, setStorageType] = useState("local"); // 'supabase' or 'local'
  const [errorMsg, setErrorMsg] = useState("");

  // Load greetings on mount
  useEffect(() => {
    async function loadGreetings() {
      try {
        // Test if supabase is configured and table exists
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const isPlaceholder = 
          !url || 
          url.includes("placeholder") || 
          (!url.startsWith("http://") && !url.startsWith("https://"));

        if (isPlaceholder) {
          throw new Error("Supabase is using placeholder or invalid credentials");
        }

        const { data, error } = await supabase
          .from("guestbook")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(30);

        if (error) throw error;

        if (data && data.length > 0) {
          setGreetings(data);
        } else {
          // If table is empty, use defaults and save to state
          setGreetings(DEFAULT_GREETINGS);
        }
        setStorageType("supabase");
      } catch (err) {
        console.log("Supabase unavailable, falling back to LocalStorage:", err.message);
        setStorageType("local");
        
        // Load from LocalStorage
        const localData = localStorage.getItem("annyeong_guestbook");
        if (localData) {
          try {
            setGreetings(JSON.parse(localData));
          } catch (e) {
            setGreetings(DEFAULT_GREETINGS);
          }
        } else {
          setGreetings(DEFAULT_GREETINGS);
          localStorage.setItem("annyeong_guestbook", JSON.stringify(DEFAULT_GREETINGS));
        }
      } finally {
        setLoading(false);
      }
    }

    loadGreetings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);
    setErrorMsg("");

    const newGreeting = {
      name: name.trim(),
      message: message.trim(),
      created_at: new Date().toISOString(),
    };

    try {
      if (storageType === "supabase") {
        const { data, error } = await supabase
          .from("guestbook")
          .insert([newGreeting])
          .select();

        if (error) throw error;
        
        if (data && data[0]) {
          setGreetings((prev) => [data[0], ...prev]);
        } else {
          // Fallback if select doesn't return data
          setGreetings((prev) => [{ id: Math.random().toString(), ...newGreeting }, ...prev]);
        }
      } else {
        // Save to local storage
        const updated = [{ id: Date.now().toString(), ...newGreeting }, ...greetings];
        setGreetings(updated);
        localStorage.setItem("annyeong_guestbook", JSON.stringify(updated));
      }

      setName("");
      setMessage("");
    } catch (err) {
      console.error("Submission failed, attempting LocalStorage fallback:", err);
      setErrorMsg("클라우드 전송에 실패하여 브라우저에 임시 저장되었습니다.");
      
      // Fallback submission to local storage
      const updated = [{ id: Date.now().toString(), ...newGreeting }, ...greetings];
      setGreetings(updated);
      localStorage.setItem("annyeong_guestbook", JSON.stringify(updated));
      setStorageType("local");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to generate a consistent avatar color gradient based on name string
  const getAvatarGradient = (str) => {
    const code = str.charCodeAt(0) || 0;
    const gradients = [
      "from-teal-500 to-emerald-500 text-teal-950",
      "from-purple-500 to-indigo-500 text-purple-950",
      "from-pink-500 to-rose-500 text-rose-950",
      "from-amber-500 to-orange-500 text-amber-950",
      "from-sky-500 to-blue-500 text-sky-950",
    ];
    return gradients[code % gradients.length];
  };

  // Helper to format date nicely
  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat("ko-KR", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (e) {
      return "방금 전";
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 shadow-2xl relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold font-serif text-zinc-100 flex items-center gap-2">
            방명록 / 인사 나누기
            <span className="text-xs font-sans font-medium px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Community
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            이곳에 따뜻한 안부 인사나 사이트 방문 소감을 남겨주세요.
          </p>
        </div>

        {/* Database status pill */}
        <div className="flex items-center gap-2 bg-zinc-900/60 border border-white/5 px-3 py-1 rounded-full text-xs">
          <span className={`w-2 h-2 rounded-full ${storageType === "supabase" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}></span>
          <span className="text-zinc-400">
            {storageType === "supabase" ? "Cloud Sync On" : "Local Storage Mode"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 flex flex-col gap-4 self-start bg-zinc-950/30 p-5 rounded-2xl border border-white/5">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="작성자 이름"
              maxLength={20}
              required
              className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">메시지</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="따뜻한 인사 한마디를 남겨주세요..."
              rows={3}
              maxLength={150}
              required
              className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all resize-none"
            />
          </div>

          {errorMsg && (
            <div className="text-[11px] text-amber-400 bg-amber-400/5 border border-amber-400/10 px-3 py-2 rounded-lg">
              ⚠️ {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold text-sm py-3 px-4 rounded-xl transition-all duration-300 transform active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow-lg shadow-teal-500/10"
          >
            {submitting ? (
              <span className="inline-block w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "인사말 등록하기"
            )}
          </button>
        </form>

        {/* Greetings List Column */}
        <div className="lg:col-span-3 flex flex-col gap-3 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-500 text-sm gap-2">
              <span className="w-6 h-6 border-2 border-zinc-700 border-t-teal-400 rounded-full animate-spin"></span>
              인사말 불러오는 중...
            </div>
          ) : greetings.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-sm">
              아직 등록된 인사말이 없습니다. 첫 인사를 남겨보세요!
            </div>
          ) : (
            greetings.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900/30 border border-white/5 rounded-2xl p-4 flex gap-3.5 items-start hover:border-white/10 transition-colors"
              >
                {/* Simulated Avatar */}
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-xs font-bold shrink-0 shadow-md ${getAvatarGradient(item.name)}`}>
                  {item.name.substring(0, 2)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline gap-2 mb-1">
                    <span className="text-sm font-semibold text-zinc-200 truncate">{item.name}</span>
                    <span className="text-[10px] text-zinc-500 shrink-0">{formatDate(item.created_at)}</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed break-words whitespace-pre-wrap">{item.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
