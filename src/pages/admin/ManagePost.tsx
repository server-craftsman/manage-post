import React, { useState, useEffect } from 'react';
import Post from '../../components/admin/Post';
import SearchPost from '../../components/admin/SearchPost';
import { IPost } from '../../models/Posts';
import { getAllPosts } from '../../services/posts';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const ManagePost: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedStartDate, setSelectedStartDate] = useState<Dayjs | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Dayjs | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getAllPosts();
        setPosts(response);
        setFilteredPosts(response);
      } catch (err) {
        setError('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const filtered = posts.filter((post) => {
      const matchesTitleOrDescription =
        post.title.toLowerCase().includes(searchText.toLowerCase()) ||
        post.description.toLowerCase().includes(searchText.toLowerCase());

      const postDate = dayjs(post.createDate);
      const matchesDate =
        (selectedStartDate ? postDate.isSameOrAfter(selectedStartDate, 'day') : true) &&
        (selectedEndDate ? postDate.isSameOrBefore(selectedEndDate, 'day') : true);

      const matchesStatus = selectedStatus ? post.status === selectedStatus : true;

      return matchesTitleOrDescription && matchesDate && matchesStatus;
    });

    setFilteredPosts(filtered);
  }, [searchText, selectedStartDate, selectedEndDate, selectedStatus, posts]);

  const handleReset = () => {
    setSearchText('');
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setSelectedStatus('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Posts</h1>
      <SearchPost
        searchText={searchText}
        setSearchText={setSearchText}
        selectedStartDate={selectedStartDate}
        setSelectedStartDate={setSelectedStartDate}
        selectedEndDate={selectedEndDate}
        setSelectedEndDate={setSelectedEndDate}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        handleReset={handleReset}
      />
      <Post posts={filteredPosts} loading={loading} error={error} />
    </div>
  );
};

export default ManagePost;
