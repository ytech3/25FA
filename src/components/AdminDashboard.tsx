import React, { useState, useEffect } from 'react';
import { supabase, ParticipantEntry } from '../lib/supabase';
import { Download, Users, Trophy, Calendar, Mail, Phone } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [participants, setParticipants] = useState<ParticipantEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    marketingOptIns: 0,
    prizeBreakdown: {} as Record<string, number>
  });

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    if (!supabase) {
      console.warn('Supabase not connected. Cannot fetch participants.');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .order('entry_timestamp', { ascending: false });

      if (error) throw error;

      setParticipants(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching participants:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: ParticipantEntry[]) => {
    const total = data.length;
    const marketingOptIns = data.filter(p => p.marketing_opt_in).length;
    const prizeBreakdown = data.reduce((acc, p) => {
      acc[p.prize_won] = (acc[p.prize_won] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setStats({ total, marketingOptIns, prizeBreakdown });
  };

  const exportToCSV = () => {
    const headers = [
      'Entry Date',
      'First Name',
      'Last Name', 
      'Email',
      'Phone',
      'Marketing Opt-In',
      'Prize Won',
      'Prize ID'
    ];

    const csvContent = [
      headers.join(','),
      ...participants.map(p => [
        new Date(p.entry_timestamp).toLocaleString(),
        p.first_name,
        p.last_name,
        p.email,
        p.phone,
        p.marketing_opt_in ? 'Yes' : 'No',
        `"${p.prize_won}"`,
        p.prize_id
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rays-prize-wheel-entries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading participant data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Prize Wheel Analytics</h1>
              <p className="text-gray-600 mt-1">Tampa Bay Rays Digital Prize Wheel Dashboard</p>
            </div>
            <button
              onClick={exportToCSV}
              className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-900 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Participants</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Mail className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Marketing Opt-Ins</p>
                <p className="text-2xl font-bold text-gray-900">{stats.marketingOptIns}</p>
                <p className="text-sm text-gray-500">
                  {stats.total > 0 ? Math.round((stats.marketingOptIns / stats.total) * 100) : 0}% opt-in rate
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Prizes Awarded</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(stats.prizeBreakdown).length}</p>
                <p className="text-sm text-gray-500">Different prize types</p>
              </div>
            </div>
          </div>
        </div>

        {/* Prize Breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Prize Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.prizeBreakdown).map(([prize, count]) => (
              <div key={prize} className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{prize}</h3>
                <p className="text-2xl font-bold text-blue-900">{count}</p>
                <p className="text-sm text-gray-500">
                  {stats.total > 0 ? Math.round((count / stats.total) * 100) : 0}% of total
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Participants Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Participants</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prize Won
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marketing
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {participants.map((participant) => (
                  <tr key={participant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {participant.first_name} {participant.last_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {participant.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {participant.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {participant.prize_won}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(participant.entry_timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        participant.marketing_opt_in 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {participant.marketing_opt_in ? 'Opted In' : 'No'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;