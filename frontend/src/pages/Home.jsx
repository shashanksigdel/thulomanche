import React, { useState } from 'react';
import { ProfileHeader } from '../components/ProfileHeader';
import { PostsList } from '../components/PostsList';

export const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <div>
      <ProfileHeader 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <div style={{ paddingBottom: 48 }}>
        <PostsList selectedCategory={selectedCategory} />
      </div>
    </div>
  );
};
