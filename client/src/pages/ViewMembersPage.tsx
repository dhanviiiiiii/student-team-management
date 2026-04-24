import { Link } from "wouter";
import Header from "@/components/Header";
import { trpc } from "@/lib/trpc";

export default function ViewMembersPage() {
  const { data: members, isLoading } = trpc.members.getAll.useQuery();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-black mb-2">Team Members</h2>
          <div className="h-1 w-16 bg-red-600"></div>
          <p className="text-lg text-gray-600 mt-4">
            {members?.length || 0} member{members?.length !== 1 ? "s" : ""} in your team
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-xl text-gray-600">Loading members...</p>
          </div>
        ) : !members || members.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-600 mb-6">No members yet</p>
            <Link href="/add-member">
              <button className="px-8 py-4 bg-red-600 text-white font-bold text-lg hover:bg-red-700 transition">
                Add First Member
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => (
              <div
                key={member.id}
                className="border-2 border-black hover:shadow-lg transition"
              >
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                    <p className="text-6xl">👤</p>
                  </div>
                )}

                <div className="p-6 space-y-4">
                  <div className="border-b-2 border-red-600 pb-4">
                    <h3 className="text-2xl font-bold text-black">
                      {member.name}
                    </h3>
                    <p className="text-lg text-red-600 font-semibold">
                      {member.role}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-semibold">Email:</span> {member.email}
                    </p>
                    {member.phone && (
                      <p className="text-gray-700">
                        <span className="font-semibold">Phone:</span>{" "}
                        {member.phone}
                      </p>
                    )}
                  </div>

                  <Link href={`/member/${member.id}`}>
                    <button className="w-full px-4 py-3 bg-red-600 text-white font-bold text-center hover:bg-red-700 transition">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
