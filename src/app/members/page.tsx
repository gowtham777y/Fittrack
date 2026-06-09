'use client';

import { useState, useEffect } from 'react';

interface Member {
  id: string;
  name: string;
  email: string;
  qr_code: string;
  start_date: string;
  end_date: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function fetchMembers() {
      const res = await fetch('/api/members');
      const data = await res.json();
      if (!ignore && data.success) {
        setMembers(data.members);
      }
    }

    fetchMembers();

    return () => {
      ignore = true;
    };
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        start_date: startDate,
        end_date: endDate,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setName('');
      setEmail('');
      setStartDate('');
      setEndDate('');
      const updated = await fetch('/api/members');
      const updatedData = await updated.json();
      if (updatedData.success) setMembers(updatedData.members);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Members</h1>

      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Member</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            className="border rounded-lg p-3 text-gray-700"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="border rounded-lg p-3 text-gray-700"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Start Date</label>
            <input
              type="date"
              className="border rounded-lg p-3 text-gray-700 w-full"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">End Date</label>
            <input
              type="date"
              className="border rounded-lg p-3 text-gray-700 w-full"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Member'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 text-gray-600">Name</th>
              <th className="text-left p-4 text-gray-600">Email</th>
              <th className="text-left p-4 text-gray-600">Start Date</th>
              <th className="text-left p-4 text-gray-600">End Date</th>
              <th className="text-left p-4 text-gray-600">QR Code</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-8 text-gray-400">
                  No members yet. Add your first member above.
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 text-gray-700">{member.name}</td>
                  <td className="p-4 text-gray-700">{member.email}</td>
                  <td className="p-4 text-gray-700">
                    {new Date(member.start_date).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-gray-700">
                    {new Date(member.end_date).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-gray-500 text-sm">{member.qr_code}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}