"use client";

import { useEffect, useState } from "react";

type Mode = "login" | "signup";

type Account = {
  id: string;
  fullName: string;
  email: string;
  username: string;
  city: string;
  password: string;
  createdAt: string;
};

type Post = {
  id: string;
  author: string;
  handle: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
};

type Contact = {
  name: string;
  status: string;
  unread?: number;
  color: string;
};

type Group = {
  name: string;
  members: string;
  accent: string;
};

const seedContacts: Contact[] = [
  { name: "Salma", status: "Ready to meet in Rabat", unread: 4, color: "#d97706" },
  { name: "Youssef", status: "Shared the mosque photos", unread: 2, color: "#0f766e" },
  { name: "Nadia", status: "Dinner at Medina tonight", color: "#7c3aed" },
  { name: "Omar", status: "Travel plans for Marrakech", color: "#1d4ed8" },
  { name: "Leila", status: "New design prototypes", unread: 6, color: "#be185d" },
];

const seedGroups: Group[] = [
  { name: "Medina Circle", members: "142 members", accent: "#d97706" },
  { name: "Casablanca Creators", members: "89 members", accent: "#0f766e" },
  { name: "Atlas Traders", members: "75 members", accent: "#7c3aed" },
];

const initialPosts: Post[] = [
  {
    id: "p1",
    author: "Amal",
    handle: "@amal.rabat",
    time: "8m ago",
    content: "Sunset at the Hassan Tower with friends. The city looks magical tonight. What is your favorite place in Rabat?",
    likes: 128,
    comments: 24,
    shares: 8,
  },
  {
    id: "p2",
    author: "Khalid",
    handle: "@khalid.marrakech",
    time: "24m ago",
    content: "New café opening in Medina this weekend. Traditional mint tea and modern art under one roof — a perfect blend of culture and creativity.",
    likes: 210,
    comments: 36,
    shares: 14,
  },
];

const tzData = [
  { city: "Casablanca", zone: "Africa/Casablanca", country: "Morocco" },
  { city: "Paris", zone: "Europe/Paris", country: "France" },
  { city: "Dubai", zone: "Asia/Dubai", country: "UAE" },
  { city: "New York", zone: "America/New_York", country: "USA" },
  { city: "Rabat", zone: "Africa/Casablanca", country: "Morocco" },
];

const accountStats = [
  { label: "Followers", value: "24.8K" },
  { label: "Messages", value: "8.3K" },
  { label: "Groups", value: "34" },
  { label: "Storage", value: "1.2 TB" },
];

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function ClockPanel() {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return <div className="timezone-grid skeleton-grid" aria-hidden="true" />;
  }

  return (
    <div className="timezone-grid">
      {tzData.map((tz) => {
        const formattedTime = new Intl.DateTimeFormat("en-GB", {
          timeZone: tz.zone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now);

        const formattedDate = new Intl.DateTimeFormat("en-US", {
          timeZone: tz.zone,
          weekday: "short",
          month: "short",
          day: "numeric",
        }).format(now);

        return (
          <div key={`${tz.city}-${tz.country}`} className="timezone-card">
            <div className="timezone-city">{tz.city}</div>
            <div className="timezone-time">{formattedTime}</div>
            <div className="timezone-date">{formattedDate}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function HomePage() {
  const [mode, setMode] = useState<Mode>("login");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [currentUser, setCurrentUser] = useState<Account | null>(null);
  const [notice, setNotice] = useState("Welcome back to Maghreb Chat");
  const [newPost, setNewPost] = useState("");
  const [signupForm, setSignupForm] = useState({
    fullName: "",
    email: "",
    username: "",
    city: "",
    password: "",
  });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  useEffect(() => {
    const storedAccounts = readStorage<Account[]>("maghreb-chat-accounts", []);
    const storedUser = readStorage<Account | null>("maghreb-chat-current-user", null);
    const storedPosts = readStorage<Post[]>("maghreb-chat-posts", initialPosts);

    setAccounts(storedAccounts);
    setCurrentUser(storedUser);
    setPosts(storedPosts);
  }, []);

  useEffect(() => {
    writeStorage("maghreb-chat-accounts", accounts);
  }, [accounts]);

  useEffect(() => {
    writeStorage("maghreb-chat-posts", posts);
  }, [posts]);

  useEffect(() => {
    if (currentUser) {
      writeStorage("maghreb-chat-current-user", currentUser);
    } else {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("maghreb-chat-current-user");
      }
    }
  }, [currentUser]);

  const handleSignup = () => {
    const { fullName, email, username, city, password } = signupForm;

    if (!fullName.trim() || !email.trim() || !username.trim() || !city.trim() || !password.trim()) {
      setNotice("Please fill in all fields to create your account.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const alreadyExists = accounts.some((account) => account.email.toLowerCase() === normalizedEmail);

    if (alreadyExists) {
      setNotice("This email is already registered. Please log in instead.");
      return;
    }

    const newUser: Account = {
      id: crypto.randomUUID(),
      fullName: fullName.trim(),
      email: normalizedEmail,
      username: username.trim(),
      city: city.trim(),
      password,
      createdAt: new Date().toISOString(),
    };

    const nextAccounts = [newUser, ...accounts];
    setAccounts(nextAccounts);
    setCurrentUser(newUser);
    setNotice(`Welcome ${newUser.fullName}! Your account is ready.`);
    setSignupForm({ fullName: "", email: "", username: "", city: "", password: "" });
  };

  const handleLogin = () => {
    const normalizedEmail = loginForm.email.trim().toLowerCase();
    const user = accounts.find(
      (account) => account.email.toLowerCase() === normalizedEmail && account.password === loginForm.password
    );

    if (!user) {
      setNotice("Invalid email or password. Try again or sign up.");
      return;
    }

    setCurrentUser(user);
    setNotice(`Welcome back, ${user.fullName}!`);
    setLoginForm({ email: "", password: "" });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setNotice("You have been signed out.");
  };

  const handleCreatePost = () => {
    if (!currentUser) return;

    const content = newPost.trim();
    if (!content) {
      setNotice("Write something before publishing your post.");
      return;
    }

    const newEntry: Post = {
      id: crypto.randomUUID(),
      author: currentUser.fullName,
      handle: `@${currentUser.username}`,
      time: "just now",
      content,
      likes: 0,
      comments: 0,
      shares: 0,
    };

    setPosts((prev) => [newEntry, ...prev]);
    setNewPost("");
    setNotice("Your post has been published.");
  };

  if (!currentUser) {
    return (
      <main className="auth-page">
        <div className="auth-shell">
          <div className="auth-brand">
            <div className="brand-mark">M</div>
            <div>
              <h1>Maghreb Chat</h1>
              <p>Connect across Morocco and North Africa</p>
            </div>
          </div>

          <div className="auth-card">
            <div className="auth-tabs">
              <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
                Login
              </button>
              <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>
                Sign up
              </button>
            </div>

            {notice ? <div className="auth-notice">{notice}</div> : null}

            {mode === "login" ? (
              <div className="auth-form">
                <label>
                  Email
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="••••••••"
                  />
                </label>
                <button className="primary-button wide" onClick={handleLogin}>Login</button>
              </div>
            ) : (
              <div className="auth-form">
                <label>
                  Full name
                  <input
                    value={signupForm.fullName}
                    onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                    placeholder="Noura El Amrani"
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                </label>
                <label>
                  Username
                  <input
                    value={signupForm.username}
                    onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                    placeholder="noura_rabat"
                  />
                </label>
                <label>
                  City
                  <input
                    value={signupForm.city}
                    onChange={(e) => setSignupForm({ ...signupForm, city: e.target.value })}
                    placeholder="Rabat"
                  />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    placeholder="Create a strong password"
                  />
                </label>
                <button className="primary-button wide" onClick={handleSignup}>Create account</button>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="maghreb-shell">
      <aside className="sidebar">
        <div className="brand-box">
          <div className="brand-mark">M</div>
          <div>
            <div className="brand-name">Maghreb Chat</div>
            <small>Connect across the North</small>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="section-header">
            <span>Contacts</span>
            <button>+</button>
          </div>
          <div className="contact-list">
            {seedContacts.map((contact) => (
              <div key={contact.name} className="contact-item">
                <div className="avatar" style={{ background: contact.color }}>
                  {contact.name.charAt(0)}
                </div>
                <div className="contact-copy">
                  <strong>{contact.name}</strong>
                  <span>{contact.status}</span>
                </div>
                {contact.unread ? <span className="badge">{contact.unread}</span> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-section">
          <div className="section-header">
            <span>Groups</span>
            <button>+</button>
          </div>
          {seedGroups.map((group) => (
            <div key={group.name} className="group-item">
              <span className="group-dot" style={{ background: group.accent }} />
              <div>
                <strong>{group.name}</strong>
                <small>{group.members}</small>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Community Hub</p>
            <h1>Welcome back, {currentUser.fullName.split(" ")[0]}</h1>
          </div>

          <div className="topbar-actions">
            <button className="ghost-button">Search</button>
            <button className="ghost-button" onClick={handleLogout}>Logout</button>
            <div className="profile-pill">{currentUser.fullName.charAt(0).toUpperCase()}</div>
          </div>
        </header>

        <div className="welcome-card">
          <div>
            <span className="mini-tag">Live</span>
            <h2>North Africa conversations, all in one place.</h2>
          </div>
          <button className="primary-button">New message</button>
        </div>

        <div className="clock-section">
          <div className="section-header clock-header">
            <span>Global time</span>
            <span className="dot-live">● Live</span>
          </div>
          <ClockPanel />
        </div>

        <div className="chat-window">
          <div className="chat-header">
            <div className="avatar large" style={{ background: "#d97706" }}>S</div>
            <div>
              <strong>Salma</strong>
              <small>Last seen 2 min ago</small>
            </div>
          </div>

          <div className="messages">
            <div className="bubble incoming">Hi! Are we still meeting in the Medina this evening?</div>
            <div className="bubble outgoing">Yes, 7:30 PM near the fountain. I will bring the tea set.</div>
            <div className="bubble incoming">Perfect! I’ll invite everyone from the group.</div>
          </div>

          <div className="composer">
            <input type="text" value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="Type a message..." aria-label="Type a message" />
            <button onClick={handleCreatePost}>Send</button>
          </div>
        </div>
      </section>

      <aside className="right-panel">
        <div className="profile-card">
          <div className="cover" />
          <div className="profile-body">
            <div className="avatar profile-avatar" style={{ background: "linear-gradient(135deg, #d97706, #f59e0b)" }}>
              {currentUser.fullName.charAt(0).toUpperCase()}
            </div>
            <h3>{currentUser.fullName}</h3>
            <p>{currentUser.city} • @{currentUser.username}</p>
            <button className="primary-button alt">Edit profile</button>
          </div>
        </div>

        <div className="stats-card">
          <div className="section-header">
            <span>Account</span>
            <span className="status-pill">Online</span>
          </div>
          <div className="stats-grid">
            {accountStats.map((stat) => (
              <div key={stat.label} className="stat-box">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="posts-card">
          <div className="section-header">
            <span>Posts</span>
            <button>View all</button>
          </div>

          {posts.map((post) => (
            <article key={post.id} className="post-item">
              <div className="post-head">
                <div className="avatar small" style={{ background: "#0f766e" }}>{post.author.charAt(0)}</div>
                <div>
                  <strong>{post.author}</strong>
                  <small>
                    {post.handle} • {post.time}
                  </small>
                </div>
              </div>
              <p>{post.content}</p>
              <div className="post-stats">
                <span>♥ {post.likes}</span>
                <span>💬 {post.comments}</span>
                <span>↗ {post.shares}</span>
              </div>
            </article>
          ))}
        </div>
      </aside>
    </main>
  );
}
