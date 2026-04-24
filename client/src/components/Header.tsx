import { Link } from "wouter";

export default function Header() {
  return (
    <header className="border-b border-black bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <span className="text-3xl font-bold text-black cursor-pointer hover:opacity-80 transition">
              Team Management
            </span>
          </Link>
        </div>
        <nav className="flex gap-8">
          <Link href="/">
            <span className="text-lg font-semibold text-black hover:text-red-600 transition border-b-2 border-transparent hover:border-red-600 pb-1 cursor-pointer">
              Home
            </span>
          </Link>
          <Link href="/add-member">
            <span className="text-lg font-semibold text-black hover:text-red-600 transition border-b-2 border-transparent hover:border-red-600 pb-1 cursor-pointer">
              Add Member
            </span>
          </Link>
          <Link href="/members">
            <span className="text-lg font-semibold text-black hover:text-red-600 transition border-b-2 border-transparent hover:border-red-600 pb-1 cursor-pointer">
              View Members
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
