export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Welcome to My App 🚀</h1>
      <p className="text-gray-600 mt-2">
        You can explore the homepage without signing in.
      </p>
      <div className="flex gap-4 mt-6">
        <a href="/signup" className="bg-blue-500 text-white px-4 py-2 rounded">
          Sign Up
        </a>
        <a href="/login" className="bg-gray-800 text-white px-4 py-2 rounded">
          Login
        </a>
      </div>
    </main>
  );
}
