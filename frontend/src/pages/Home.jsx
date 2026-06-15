import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProfileHeader } from '../components/ProfileHeader';
import { PostsList } from '../components/PostsList';
import { UnicodeToPreetiConverter } from './tools/UnicodeToPreetiConverter';

export const Home = () => {
  const [searchParams] = useSearchParams();
  const [selectedTool, setSelectedTool] = useState(null);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'unicode-to-preeti') {
      setSelectedTool('unicode-to-preeti');
    } else {
      setSelectedTool(null);
    }
  }, [searchParams]);

  const handleToolSelect = (tool) => {
    setSelectedTool(tool === selectedTool ? null : tool);
  };

  return (
    <div>
      <ProfileHeader onToolSelect={handleToolSelect} activeTab={selectedTool} />
      
      {selectedTool === 'unicode-to-preeti' && <UnicodeToPreetiConverter />}

      {!selectedTool && (
        <div style={{ paddingBottom: 48 }}>
          <PostsList />
        </div>
      )}
    </div>
  );
};
