"use client";

import { useEffect, useState } from "react";

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

type Post = {
  author: string;
  handle: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
};

const tzData = [
  { city: "Casablanca", zone: "Africa/Casablanca", country: "Morocco" },
  { city: "Paris", zone: "Europe/Paris", country: "France" },
  { city: "Dubai", zone: "Asia/Dubai", country: "UAE" },
  { city: "New York", zone: "America/New_York", country: "USA" },
  { city: "Rabat", zone: "Africa/Casablanca", country: "Morocco" },
];

const contacts: Contact[] = [
  { name: "Salma", status: "Ready to meet in Rabat", unread: 4, color: "#d97706" },
  { name: "Youssef", status: "Shared the mosque photos", unread: 2, color: "#0f766e" },
  { name: "Nadia", status: "Dinner at Medina tonight", color: "#7c3aed" },
  { name: "Omar", status: "Travel plans for Marrakech", color: "#1d4ed8" },
  { name: "Leila", status: "New design prototypes", unread: 6, color: "#be185d" },
];

const groups: Group[] = [
  { name: "Medina Circle", members: "142 members", accent: "#d97706" },
  { name: "Casablanca Creators", members: "89 members", accent: "#0f766e" },
  { name: "Atlas Traders", members: "75 members", accent: "#7c3aed" },
];

const posts: Post[] = [
  {
    author: "Amal",
    handle: "@amal.rabat",
    time: "8m ago",
    content:
      "Sunset at the Hassan Tower with friends. The city looks magical tonight. What is your favorite place in Rabat?",
    likes: 128,
    comments: 24,
    shares: 8,
  },
  {
    author: "Khalid",
    handle: "@khalid.marrakech",
    time: "24m ago",
    content:
      "New café opening in Medina this weekend. Traditional mint tea and modern art under one roof — a perfect blend of culture and creativity.",
    likes: 210,
    comments: 36,
    shares: 14,
  },
];

const accountStats = [
  { label: "Followers", value: "24.8K" },
  { label: "Messages", value: "8.3K" },
  { label: "Groups", value: "34" },
  { label: "Storage", value: "1.2 TB" },
];

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
            {contacts.map((contact) => (
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
          {groups.map((group) => (
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
            <h1>Welcome back, Noura</h1>
          </div>

          <div className="topbar-actions">
            <button className="ghost-button">Search</button>
            <div className="profile-pill">N</div>
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
            <input type="text" defaultValue="Type a message..." aria-label="Type a message" />
            <button>Send</button>
          </div>
        </div>
      </section>

      <aside className="right-panel">
        <div className="profile-card">
          <div className="cover" />
          <div className="profile-body">
            <div className="avatar profile-avatar" style={{ background: "linear-gradient(135deg, #d97706, #f59e0b)" }}>
              N
            </div>
            <h3>Noura El Amrani</h3>
            <p>Digital storyteller • Rabat</p>
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
            <article key={post.author} className="post-item">
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
