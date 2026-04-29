import React, { useState } from 'react';
import { ProfileHeader } from '../components/ProfileHeader';
import { PostsList } from '../components/PostsList';
import { UnicodeToPreetiConverter } from './tools/UnicodeToPreetiConverter';

export const Home = () => {
  const [selectedTool, setSelectedTool] = useState(null);

  const handleToolSelect = (tool) => {
    setSelectedTool(tool === selectedTool ? null : tool);
  };

  return (
    <div>
      <ProfileHeader onToolSelect={handleToolSelect} />
      
      {selectedTool === 'unicode-to-preeti' && <UnicodeToPreetiConverter />}

      {!selectedTool && (
        <div style={{ paddingBottom: 48 }}>
          <PostsList />
        </div>
      )}
    </div>
  );
};
