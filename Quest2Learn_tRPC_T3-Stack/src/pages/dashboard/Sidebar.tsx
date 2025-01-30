import React from 'react';
import { BiHomeCircle, BiBookContent, BiUserCircle, BiInfoCircle, BiBell, BiCog } from 'react-icons/bi';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-title">Dashboard</div>
      <div className="sidebar-elements">
        <div>
          <BiInfoCircle style={{ marginRight: '10px' }} />
          Class Information
        </div>
        <div>
          <BiBell style={{ marginRight: '10px' }} />
          Notifications
        </div>
        <div>
          <BiUserCircle style={{ marginRight: '10px' }} />
          Profile
        </div>
        <div>
          <BiCog style={{ marginRight: '10px' }} />
          Settings
        </div>
      </div>
    </div>
  );
}

export default Sidebar;