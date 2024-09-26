import React from 'react';
import { Pagination } from 'antd';

interface PaginationComponentProps {
  currentPage: number;
  postsPerPage: number;
  totalPosts: number;
  onPageChange: (page: number) => void;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({ currentPage, postsPerPage, totalPosts, onPageChange }) => {
  return (
    <Pagination
      current={currentPage}
      pageSize={postsPerPage}
      total={totalPosts}
      onChange={onPageChange}
      style={{ textAlign: 'center', marginTop: '20px' }}
    />
  );
};

export default PaginationComponent;
