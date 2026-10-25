// DEMO ONLY: accounts live in this browser's localStorage. There is no server.
const USERS_KEY = "rb_demo_users";
const SESSION_KEY = "rb_demo_session";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked - ignore */
  }
};

const toHex = (buffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

const makeSalt = () => toHex(crypto.getRandomValues(new Uint8Array(12)));

async function hashPassword(password, salt) {
  if (!globalThis.crypto?.subtle) {
    throw new Error("This browser needs a secure (https) connection to sign in.");
  }
  const data = new TextEncoder().encode(`${salt}:${password}`);
  return toHex(await crypto.subtle.digest("SHA-256", data));
}

const normalizeEmail = (email) => (email || "").trim().toLowerCase();

export const getSession = () => {
  const session = read(SESSION_KEY, null);
  return session && session.email && session.name ? session : null;
};

export async function signUp({ name, email, password }) {
  await wait(500);

  const cleanEmail = normalizeEmail(email);
  const users = read(USERS_KEY, []);

  if (users.some((u) => u.email === cleanEmail)) {
    throw new Error("An account with this email already exists. Try signing in.");
  }

  const salt = makeSalt();
  const hash = await hashPassword(password, salt);
  const user = { name: name.trim(), email: cleanEmail };

  write(USERS_KEY, [...users, { ...user, salt, hash }]);
  write(SESSION_KEY, user);
  return user;
}

export async function signIn({ email, password }) {
  await wait(500);

  const cleanEmail = normalizeEmail(email);
  const found = read(USERS_KEY, []).find((u) => u.email === cleanEmail);
  const hash = found ? await hashPassword(password, found.salt) : "";

  if (!found || hash !== found.hash) {
    throw new Error("Incorrect email or password.");
  }

  const user = { name: found.name, email: found.email };
  write(SESSION_KEY, user);
  return user;
}

export const signOut = () => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
};

export const firstName = (name) => (name || "").trim().split(/\s+/)[0] || "";

export const getInitials = (name) => {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
};