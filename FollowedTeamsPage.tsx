
// components/FollowedTeamsPage.tsx
import React, { useState, useMemo } from 'react';
import { FollowedTeam, Team, TeamLevel } from '../types';

interface FollowedTeamsPageProps {
  followedTeams: FollowedTeam[];
  onSelectTeam: (team: Team) => void;
  onToggleFavorite: (teamId: string) => void;
  onUnfollow: (team: Team) => void; // Using Team object to unfollow
  allTeams: Team[]; // To search for new teams to follow
  managedTeamId?: string;
}

const prefectures = ['東京都', '大阪府', '福岡県', '北海道', '神奈川県', /* ... other prefectures ... */ ]; // Simplified list

const FollowedTeamsPage: React.FC<FollowedTeamsPageProps> = ({ 
    followedTeams, onSelectTeam, onToggleFavorite, onUnfollow, allTeams, managedTeamId 
}) => {
  const [filterPrefecture, setFilterPrefecture] = useState('');
  const [filterCity, setFilterCity] = useState(''); // For simplicity, city filter is text input
  const [searchTerm, setSearchTerm] = useState(''); // For team name search

  const filteredFollowedTeams = useMemo(() => {
    return followedTeams.filter(team => {
      const prefectureMatch = filterPrefecture ? team.prefecture === filterPrefecture : true;
      const cityMatch = filterCity ? (team.city || '').toLowerCase().includes(filterCity.toLowerCase()) : true;
      const nameMatch = searchTerm ? team.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      return prefectureMatch && cityMatch && nameMatch;
    });
  }, [followedTeams, filterPrefecture, filterCity, searchTerm]);

  return (
    <div className="space-y-6"> {/* Reduced main spacing from space-y-8 */}
      <h2 className="text-2xl sm:text-3xl font-semibold text-sky-300">フォロー中のチーム一覧</h2> {/* Slightly smaller header */}

      {/* Filters Section */}
      <div className="bg-slate-800 p-4 sm:p-6 rounded-xl shadow-xl space-y-3 sm:space-y-4 md:flex md:flex-wrap md:gap-3 items-end"> {/* Reduced padding and gap */}
        <div>
          <label htmlFor="filterPrefecture" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">都道府県</label>
          <select id="filterPrefecture" value={filterPrefecture} onChange={(e) => setFilterPrefecture(e.target.value)}
            className="w-full md:w-auto bg-slate-700 border border-slate-600 text-white rounded-md p-1.5 sm:p-2 text-xs sm:text-sm focus:ring-sky-500 focus:border-sky-500"> {/* Reduced padding and font size */}
            <option value="">すべて</option>
            {prefectures.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="filterCity" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">市区町村</label>
          <input type="text" id="filterCity" value={filterCity} onChange={(e) => setFilterCity(e.target.value)} placeholder="例: 渋谷区"
            className="w-full md:w-auto bg-slate-700 border border-slate-600 text-white rounded-md p-1.5 sm:p-2 text-xs sm:text-sm focus:ring-sky-500 focus:border-sky-500" /> {/* Reduced padding and font size */}
        </div>
        <div>
          <label htmlFor="searchTerm" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">チーム名検索</label>
          <input type="text" id="searchTerm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="チーム名..."
            className="w-full md:w-auto bg-slate-700 border border-slate-600 text-white rounded-md p-1.5 sm:p-2 text-xs sm:text-sm focus:ring-sky-500 focus:border-sky-500" /> {/* Reduced padding and font size */}
        </div>
      </div>

      {/* Followed Teams List */}
      {filteredFollowedTeams.length > 0 ? (
        // Grid with reduced gap for more items
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"> {/* Reduced gap from gap-4 to gap-3, added sm target */}
          {filteredFollowedTeams.map(team => (
            // <!-- Each Team Item - Compacted -->
            // styles.item equivalent: Overall container for a team card.
            <div key={team.id} className={`bg-slate-800 rounded-lg shadow-xl overflow-hidden border ${team.isFavorite ? 'border-yellow-500' : 'border-slate-700'} flex flex-col`}> {/* Reduced rounding, shadow, border adjustments */}
              {/* Team Icon/Logo */}
              {/* styles.icon equivalent: Container for the team logo. Height reduced significantly. Aim for 32x32px "feel". */}
              <div className="h-20 sm:h-24 w-full overflow-hidden cursor-pointer" onClick={() => onSelectTeam(team)}> {/* Reduced height from h-28 to h-20/h-24 for ~32px icon feel */}
                <img src={team.logoUrl} alt={`${team.name} ロゴ`} className="w-full h-full object-cover" />
              </div>
              {/* Content Area */}
              {/* styles.text or general content area: Padding reduced for compactness. */}
              <div className="p-2 sm:p-2.5 flex flex-col flex-grow"> {/* Reduced padding from p-3 to p-2/p-2.5 */}
                {/* Team Name */}
                {/* Font size reduced by ~2pt (e.g., text-lg to text-sm or text-base). */}
                <h3 className="text-sm sm:text-base font-semibold text-sky-400 mb-0.5 truncate cursor-pointer hover:underline" onClick={() => onSelectTeam(team)}>{team.name}</h3> {/* Reduced font size (e.g. from text-lg) & margin */}
                
                {/* Location */}
                <p className="text-xs text-slate-400 mb-0.5 truncate">{team.prefecture}{team.city ? `, ${team.city}` : ''}</p> {/* Font size already small, margin adjusted */}
                
                {/* Level and Rating */}
                <p className="text-xs text-slate-500 mb-1"> {/* Font size already small, margin adjusted */}
                  L: {team.level.substring(0,2)} | R: {team.rating} {/* Shortened "Level" */}
                </p>
                
                {/* Available Slots - if shown, keep very brief */}
                <p className="text-xs text-slate-500 mb-1.5 sm:mb-2"> {/* Margin adjusted */}
                  空き: <span className="font-semibold">{team.availableSlotsText || '-'}</span> {/* Shortened text, ensure it's brief */}
                </p>
                
                {/* Action Buttons: Ensure touch targets are at least 44x44dp. Padding and font size adjusted. */}
                <div className="space-y-1 mt-auto"> {/* Reduced space-y from 1.5 */}
                  <button onClick={() => onSelectTeam(team)} className="w-full text-xs bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-2.5 rounded-md transition"> {/* Min padding py-2 for touch target height */}
                    詳細 {/* Shortened "プロフィールを見る" */}
                  </button>
                  <div className="flex gap-1"> {/* Reduced gap from 1.5 */}
                    <button onClick={() => onToggleFavorite(team.id)} className={`w-1/2 text-xs font-medium py-2 px-2 rounded-md transition ${team.isFavorite ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-slate-700 hover:bg-slate-600'}`}> {/* Min padding py-2 */}
                      {team.isFavorite ? '★解除' : '☆追加'}
                    </button>
                    <button onClick={() => onUnfollow(team)} className="w-1/2 text-xs bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-2 rounded-md transition"> {/* Min padding py-2 */}
                      解除 {/* Shortened "フォロー解除" */}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-400 text-lg sm:text-xl py-8 sm:py-10">条件に合うフォロー中のチームはありません。</p> {/* Adjusted padding */}
      )}
      
      {/* Search all teams to follow (Simplified) */}
       <div className="mt-10 pt-6 border-t border-slate-700"> {/* Adjusted spacing */}
        <h3 className="text-xl sm:text-2xl font-semibold text-sky-300 mb-3">新しいチームを探す (簡易表示)</h3> {/* Adjusted spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3"> {/* Adjusted spacing */}
            {allTeams.filter(t => t.id !== managedTeamId && !followedTeams.find(ft => ft.id === t.id)).slice(0,3).map(teamToFollow => (
                 <div key={teamToFollow.id} className="bg-slate-700 p-3 rounded-lg"> {/* Reduced padding */}
                    <h4 className="font-semibold text-sky-400 text-sm sm:text-base truncate">{teamToFollow.name}</h4> {/* Adjusted font size */}
                    <p className="text-xs text-slate-300 truncate">{teamToFollow.prefecture}</p>
                    <button onClick={() => onUnfollow(teamToFollow)} className="mt-2 w-full text-xs sm:text-sm bg-green-600 hover:bg-green-700 text-white font-medium py-1.5 px-3 rounded-md transition"> {/* Reduced padding */}
                        フォローする
                    </button>
                 </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FollowedTeamsPage;
