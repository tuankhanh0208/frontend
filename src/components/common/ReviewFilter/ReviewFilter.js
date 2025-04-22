import React, { useState } from 'react';
import styled from 'styled-components';
import { FaStar } from 'react-icons/fa';

const FilterContainer = styled.div`
  margin-bottom: 20px;
`;

const StatContainer = styled.div`
  border-radius: 8px;
  background-color: #f8f8f8;
  padding: 15px;
  margin-bottom: 20px;
`;

const AverageRating = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  
  .rating-value {
    font-size: 2.5rem;
    font-weight: bold;
    color: #333;
  }
  
  .stars {
    display: flex;
    margin-top: 5px;
  }
  
  .total-reviews {
    font-size: 0.9rem;
    color: #666;
    margin-top: 5px;
  }
`;

const RatingBars = styled.div`
  margin-top: 10px;
`;

const RatingBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  
  .star-label {
    display: flex;
    align-items: center;
    width: 35px;
    font-size: 14px;
    
    svg {
      color: #FFD700;
      margin-right: 3px;
    }
  }
  
  .progress-container {
    flex-grow: 1;
    height: 10px;
    background-color: #e0e0e0;
    border-radius: 5px;
    margin: 0 10px;
    overflow: hidden;
  }
  
  .progress-bar {
    height: 100%;
    background-color: #4CAF50;
    border-radius: 5px;
  }
  
  .count {
    width: 40px;
    text-align: right;
    font-size: 14px;
    color: #666;
  }
`;

const FilterOptions = styled.div`
  margin-top: 20px;
`;

const FilterTitle = styled.h4`
  font-size: 16px;
  margin: 0 0 10px;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
`;

const FilterList = styled.div``;

const FilterItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  
  input[type="checkbox"] {
    margin-right: 10px;
  }
  
  label {
    color: #555;
    font-size: 14px;
    cursor: pointer;
  }
`;

const RatingFilterItem = styled(FilterItem)`
  .stars {
    display: flex;
    margin-left: 5px;
  }
`;

const TextFilterButton = styled.button`
  margin-top: 5px;
  padding: 8px 15px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #555;
  cursor: pointer;
  margin-right: 10px;
  
  &.active {
    background-color: #4CAF50;
    border-color: #4CAF50;
    color: white;
  }
  
  &:hover:not(.active) {
    background-color: #e5e5e5;
  }
`;

const ReviewFilter = ({ 
  averageRating = 0, 
  totalReviews = 0, 
  ratingCounts = [0, 0, 0, 0, 0],
  onFilterChange 
}) => {
  // Các trạng thái lọc
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [hasImages, setHasImages] = useState(false);
  const [hasVideos, setHasVideos] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [activeFilterType, setActiveFilterType] = useState('all');
  
  // Xử lý khi checkbox rating thay đổi
  const handleRatingChange = (rating) => {
    const newSelectedRatings = [...selectedRatings];
    const index = newSelectedRatings.indexOf(rating);
    
    if (index === -1) {
      newSelectedRatings.push(rating);
    } else {
      newSelectedRatings.splice(index, 1);
    }
    
    setSelectedRatings(newSelectedRatings);
    applyFilters(newSelectedRatings, hasImages, hasVideos, isVerified, activeFilterType);
  };
  
  // Xử lý khi checkbox có hình ảnh thay đổi
  const handleImagesChange = (e) => {
    setHasImages(e.target.checked);
    applyFilters(selectedRatings, e.target.checked, hasVideos, isVerified, activeFilterType);
  };
  
  // Xử lý khi checkbox có video thay đổi
  const handleVideosChange = (e) => {
    setHasVideos(e.target.checked);
    applyFilters(selectedRatings, hasImages, e.target.checked, isVerified, activeFilterType);
  };
  
  // Xử lý khi checkbox đã xác minh thay đổi
  const handleVerifiedChange = (e) => {
    setIsVerified(e.target.checked);
    applyFilters(selectedRatings, hasImages, hasVideos, e.target.checked, activeFilterType);
  };
  
  // Xử lý khi nút lọc loại đánh giá được nhấn
  const handleFilterTypeChange = (type) => {
    setActiveFilterType(type);
    applyFilters(selectedRatings, hasImages, hasVideos, isVerified, type);
  };
  
  // Áp dụng tất cả bộ lọc
  const applyFilters = (ratings, withImages, withVideos, verified, filterType) => {
    if (onFilterChange) {
      onFilterChange({
        ratings,
        withImages,
        withVideos,
        verified,
        filterType
      });
    }
  };
  
  return (
    <FilterContainer>
      <StatContainer>
        <AverageRating>
          <div className="rating-value">{averageRating.toFixed(1)}</div>
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                color={i < Math.floor(averageRating) 
                  ? "#FFD700" 
                  : i < averageRating 
                    ? "#FFD700" 
                    : "#e4e5e9"} 
                size={18}
              />
            ))}
          </div>
          <div className="total-reviews">{totalReviews} đánh giá</div>
        </AverageRating>
        
        <RatingBars>
          {[5, 4, 3, 2, 1].map(stars => (
            <RatingBar key={stars}>
              <div className="star-label">
                <FaStar size={14} />
                <span>{stars}</span>
              </div>
              <div className="progress-container">
                <div 
                  className="progress-bar" 
                  style={{ 
                    width: totalReviews > 0 
                      ? `${(ratingCounts[stars-1] / totalReviews) * 100}%` 
                      : '0%'
                  }} 
                />
              </div>
              <div className="count">{ratingCounts[stars-1]}</div>
            </RatingBar>
          ))}
        </RatingBars>
      </StatContainer>
      
      <FilterOptions>
        <FilterTitle>Lọc các đánh giá</FilterTitle>
        
        <FilterList>
          {[5, 4, 3, 2, 1].map(rating => (
            <RatingFilterItem key={rating}>
              <input 
                type="checkbox" 
                id={`rating-${rating}`} 
                checked={selectedRatings.includes(rating)}
                onChange={() => handleRatingChange(rating)}
              />
              <label htmlFor={`rating-${rating}`}>
                {rating} 
                <div className="stars">
                  {[...Array(rating)].map((_, i) => (
                    <FaStar key={i} color="#FFD700" size={14} />
                  ))}
                </div>
              </label>
            </RatingFilterItem>
          ))}
          
          <FilterItem>
            <input 
              type="checkbox" 
              id="with-images"
              checked={hasImages}
              onChange={handleImagesChange}
            />
            <label htmlFor="with-images">Có hình ảnh</label>
          </FilterItem>
          
          <FilterItem>
            <input 
              type="checkbox" 
              id="with-videos"
              checked={hasVideos}
              onChange={handleVideosChange}
            />
            <label htmlFor="with-videos">Có video</label>
          </FilterItem>
          
          <FilterItem>
            <input 
              type="checkbox" 
              id="verified"
              checked={isVerified}
              onChange={handleVerifiedChange}
            />
            <label htmlFor="verified">Đã xác minh</label>
          </FilterItem>
        </FilterList>
      </FilterOptions>
      
      <FilterOptions>
        <FilterTitle>Chỉ để đánh giá</FilterTitle>
        <div>
          <TextFilterButton 
            className={activeFilterType === 'all' ? 'active' : ''}
            onClick={() => handleFilterTypeChange('all')}
          >
            Tất cả đánh giá
          </TextFilterButton>
          <TextFilterButton 
            className={activeFilterType === 'quality' ? 'active' : ''}
            onClick={() => handleFilterTypeChange('quality')}
          >
            Chất lượng
          </TextFilterButton>
          <TextFilterButton 
            className={activeFilterType === 'delivery' ? 'active' : ''}
            onClick={() => handleFilterTypeChange('delivery')}
          >
            Giao hàng
          </TextFilterButton>
          <TextFilterButton 
            className={activeFilterType === 'price' ? 'active' : ''}
            onClick={() => handleFilterTypeChange('price')}
          >
            Giá cả
          </TextFilterButton>
        </div>
      </FilterOptions>
    </FilterContainer>
  );
};

export default ReviewFilter; 