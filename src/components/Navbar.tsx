import React from 'react';
import { UserProfile } from '../types';
import { isProfileComplete } from '../store/storage';
import { ChefHat, User, Database, RefreshCw, Sparkles, Salad, LogOut, Lock } from 'lucide-react';

interface NavbarProps {
  userProfile: UserProfile;
  onSignOut: () => void;
  onOpenMongoViewer: () => void;
  onResetData: () => void;
  activeTab: 'customer_plan' | 'history' | 'profile' | 'chef_studio' | 'dishes_catalog';
  onSelectTab: (tab: 'customer_plan' | 'history' | 'profile' | 'chef_studio' | 'dishes_catalog') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userProfile,
  onSignOut,
  onOpenMongoViewer,
  onResetData,
  activeTab,
  onSelectTab
}) => {
  const isChef = userProfile.role === 'chef';
  const profileDone = isProfileComplete(userProfile);

  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="brand" onClick={() => onSelectTab(isChef ? 'chef_studio' : (profileDone ? 'customer_plan' : 'profile'))}>
          <div className="brand-logo">
            <Salad size={22} />
          </div>
          <div className="brand-text">
            <h1>SmartPlate</h1>
            <span>Precision Nutrition & Meal Planner</span>
          </div>
        </div>

        <div className="nav-actions">
          {!isChef && (
            <>
              <button
                className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => onSelectTab('profile')}
              >
                <User size={16} />
                <span>Profile</span>
                {!profileDone && (
                  <span style={{ fontSize: '0.68rem', background: '#fee2e2', color: '#991b1b', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 800 }}>
                    Required
                  </span>
                )}
              </button>
              <button
                className={`nav-btn ${activeTab === 'customer_plan' ? 'active' : ''}`}
                onClick={() => onSelectTab('customer_plan')}
                style={{ opacity: !profileDone ? 0.75 : 1 }}
                title={!profileDone ? 'Complete your Profile first' : 'Personalized Meal Planner'}
              >
                {!profileDone ? <Lock size={14} color="#94a3b8" /> : <Sparkles size={16} />}
                <span>Meal Planner</span>
              </button>
              <button
                className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => onSelectTab('history')}
                style={{ opacity: !profileDone ? 0.75 : 1 }}
              >
                Meal History
              </button>
            </>
          )}

          {isChef && (
            <>
              <button
                className={`nav-btn ${activeTab === 'chef_studio' ? 'active' : ''}`}
                onClick={() => onSelectTab('chef_studio')}
              >
                <ChefHat size={16} />
                Chef Studio
              </button>

              <button
                className={`nav-btn ${activeTab === 'dishes_catalog' ? 'active' : ''}`}
                onClick={() => onSelectTab('dishes_catalog')}
              >
                <Database size={16} />
                Dishes & Prices
              </button>
            </>
          )}

          {/* MongoDB Interactive Collections Studio */}
          {isChef && (
            <button
              className="nav-btn"
              onClick={onOpenMongoViewer}
              title="Inspect & Edit MongoDB Collections"
              style={{ background: '#042f2e', borderColor: '#059669', color: '#34d399', fontWeight: 700 }}
            >
              <Database size={16} color="#34d399" />
              <span>MongoDB</span>
            </button>
          )}

          {/* User Profile Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '20px',
            background: isChef ? '#fef3c7' : '#f0fdf4',
            border: `1px solid ${isChef ? '#fde68a' : '#bbf7d0'}`,
            fontSize: '0.82rem',
            fontWeight: 700,
            color: isChef ? '#92400e' : '#15803d'
          }}>
            {isChef ? <ChefHat size={15} color="#d97706" /> : <User size={15} color="#16a34a" />}
            <span>{userProfile.name}</span>
            <span style={{ fontSize: '0.72rem', opacity: 0.75, fontWeight: 600 }}>({isChef ? 'Chef' : 'Customer'})</span>
          </div>

          {/* Sign Out Button */}
          <button
            className="btn-toggle-role"
            onClick={onSignOut}
            title="Sign Out / Switch User"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.75rem', fontSize: '0.82rem' }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
