import React, { useState, useEffect } from 'react';
import { TrendingUp, Trophy, Target, Zap } from 'lucide-react';

const TeamLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [period, setPeriod] = useState('weekly');
  const [metric, setMetric] = useState('score');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, [period, metric]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/leaderboard?period=${period}&metric=${metric}&limit=20`
      );
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error('Leaderboard fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMedalIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="text-green-500" size={16} />;
    return <TrendingUp className="text-red-500 transform rotate-180" size={16} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Performance</h1>
          <p className="text-gray-600 mt-2">Leaderboard and performance metrics</p>
        </div>
        <Trophy className="text-yellow-500" size={48} />
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="all_time">All Time</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Metric</label>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="score">Overall Score</option>
            <option value="tickets_resolved">Tickets Resolved</option>
            <option value="satisfaction_score">Satisfaction</option>
            <option value="response_time">Response Time</option>
            <option value="ai_acceptance">AI Acceptance</option>
            <option value="kb_contribution">KB Contribution</option>
          </select>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Rank</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Agent</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Score</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Resolved</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Satisfaction</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Response Time</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Trend</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : leaderboard.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              leaderboard.map((member) => (
                <tr key={member._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getMedalIcon(member.rank) || member.rank}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                        {member.team_member_id?.name?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {member.team_member_id?.name || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {member.team_member_id?.username || 'agent'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-blue-600">{member.score}</span>
                      <Zap className="text-yellow-500" size={16} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">
                      {member.tickets_resolved}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(member.customer_satisfaction_score / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {member.customer_satisfaction_score?.toFixed(1) || 0}/5
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {member.first_response_time?.toFixed(0) || 0}m
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {getTrendIcon(member.trend)}
                      <span className="text-sm font-medium">
                        {member.trend_percentage > 0 ? '+' : ''}{member.trend_percentage?.toFixed(1) || 0}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Avg Resolution Time"
          value={leaderboard[0]?.average_resolution_time?.toFixed(1) + 'h' || '—'}
          icon={<Target />}
        />
        <StatCard
          title="Top Score"
          value={leaderboard[0]?.score?.toFixed(0) || '—'}
          icon={<Trophy />}
        />
        <StatCard
          title="Best Satisfaction"
          value={leaderboard[0]?.customer_satisfaction_score?.toFixed(1) + '/5' || '—'}
          icon={<TrendingUp />}
        />
        <StatCard
          title="KB Contributions"
          value={leaderboard.reduce((sum, m) => sum + (m.kb_articles_created || 0), 0)}
          icon={<Zap />}
        />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg p-4 border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className="text-blue-500 opacity-20">{icon}</div>
    </div>
  </div>
);

export default TeamLeaderboard;
