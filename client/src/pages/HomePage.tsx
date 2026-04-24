import { Link } from "wouter";
import Header from "@/components/Header";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="border-l-4 border-red-600 pl-6">
              <h2 className="text-5xl font-bold text-black mb-4">
                Student Team Members Management
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                A clean and efficient platform to manage your team members. Add new members, view their profiles, and keep track of your team's composition with ease.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-lg text-gray-600">
                Get started by exploring our features:
              </p>
              <div className="flex gap-4">
                <Link href="/add-member">
                  <button className="px-8 py-4 bg-red-600 text-white font-bold text-lg hover:bg-red-700 transition">
                    Add Member
                  </button>
                </Link>
                <Link href="/members">
                  <button className="px-8 py-4 border-2 border-black text-black font-bold text-lg hover:bg-black hover:text-white transition">
                    View Members
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full aspect-square bg-red-600 flex items-center justify-center">
              <div className="text-white text-center">
                <p className="text-6xl font-bold mb-4">👥</p>
                <p className="text-2xl font-bold">Team Management</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-8">
          <div className="border-t-4 border-red-600 pt-6">
            <h3 className="text-2xl font-bold text-black mb-3">Add Members</h3>
            <p className="text-gray-600">
              Easily add new team members with their details, role, and profile photo.
            </p>
          </div>
          <div className="border-t-4 border-red-600 pt-6">
            <h3 className="text-2xl font-bold text-black mb-3">View All</h3>
            <p className="text-gray-600">
              Browse all team members in a clean card layout with quick access to details.
            </p>
          </div>
          <div className="border-t-4 border-red-600 pt-6">
            <h3 className="text-2xl font-bold text-black mb-3">Member Details</h3>
            <p className="text-gray-600">
              View comprehensive information about each team member in one place.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
