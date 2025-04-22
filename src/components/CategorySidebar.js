import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch, FaShoppingBasket } from 'react-icons/fa';
import { useCategory } from '../context/CategoryContext';

const SidebarContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding-bottom: 15px;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const SidebarHeader = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  background-color: #f8f8f8;
  
  h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 8px;
      color: #4CAF50;
    }
  }
`;

const SidebarContent = styled.div`
  padding: 15px 0;
`;

const SearchBox = styled.div`
  padding: 0 20px 15px;
  position: relative;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  
  input {
    width: 100%;
    padding: 10px 15px 10px 35px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: #4CAF50;
      box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
    }
  }
  
  svg {
    position: absolute;
    left: 30px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }
`;

const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const CategoryItem = styled.li`
  border-bottom: 1px solid #f5f5f5;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: rgba(76, 175, 80, 0.05);
  }
`;

const CategoryLink = styled(Link)`
  display: block;
  padding: 12px 20px;
  color: #333;
  text-decoration: none;
  font-weight: ${props => props.active ? '600' : 'normal'};
  background-color: ${props => props.active ? 'rgba(76, 175, 80, 0.1)' : 'transparent'};
  border-left: ${props => props.active ? '3px solid #4CAF50' : '3px solid transparent'};
  
  &:hover {
    color: #4CAF50;
    border-left: 3px solid #4CAF50;
  }
`;

const PriceFilter = styled.div`
  padding: 15px 20px;
  border-top: 1px solid #eee;
  margin-top: 10px;
  
  h4 {
    margin: 0 0 15px;
    font-size: 16px;
    color: #333;
  }
  
  .price-inputs {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
    
    input {
      flex: 1;
      padding: 8px 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      
      &:focus {
        outline: none;
        border-color: #4CAF50;
      }
    }
  }
  
  button {
    width: 100%;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background-color: #388E3C;
    }
  }
`;

const LoadingState = styled.div`
  padding: 15px 20px;
  text-align: center;
  color: #666;
`;

const ErrorState = styled.div`
  padding: 15px 20px;
  color: #d32f2f;
  text-align: center;
`;

const CategorySidebar = ({ rootCategoryId, selectedSubcategory, onSubcategorySelect }) => {
  // States
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  // Refs để theo dõi trạng thái và ngăn re-render không cần thiết
  const hasFetchedRef = useRef(false);
  const isProcessingRef = useRef(false);
  const prevRootCategoryIdRef = useRef(null);
  
  // Hooks
  const { id } = useParams();
  const location = useLocation();
  
  // Context
  const { 
    fetchSubcategories, 
    getSubcategoriesFromCache 
  } = useCategory();
  
  // Memoize các hàm callback để tránh re-renders
  const memoizedFetchSubcategories = useCallback((catId, force) => {
    return fetchSubcategories(catId, force);
  }, [fetchSubcategories]);
  
  const memoizedGetCache = useCallback((catId) => {
    return getSubcategoriesFromCache(catId);
  }, [getSubcategoriesFromCache]);
  
  // Fetch subcategories khi rootCategoryId thay đổi
  useEffect(() => {
    const fetchSubcategoriesData = async () => {
      // Kiểm tra nếu không có rootCategoryId hoặc đang xử lý
      if (!rootCategoryId || isProcessingRef.current) {
        return;
      }
      
      // Kiểm tra nếu đã fetch với cùng ID và có dữ liệu
      if (
        hasFetchedRef.current &&
        prevRootCategoryIdRef.current === rootCategoryId &&
        subcategories.length > 0
      ) {
        return;
      }
      
      // Đánh dấu đang xử lý
      isProcessingRef.current = true;
      setLoading(true);
      setError(null);
      
      try {
        console.log('CategorySidebar: Fetching subcategories for', rootCategoryId);
        
        // Kiểm tra cache trước
        let data = getSubcategoriesFromCache(rootCategoryId);
        
        // Nếu không có trong cache, fetch mới
        if (!data) {
          data = await memoizedFetchSubcategories(rootCategoryId, false);
        }
        
        // Cập nhật state
        if (data && data.length > 0) {
          setSubcategories(data);
        } else {
          console.log('CategorySidebar: No subcategories found for', rootCategoryId);
          setSubcategories([]);
        }
        
        // Cập nhật refs
        hasFetchedRef.current = true;
        prevRootCategoryIdRef.current = rootCategoryId;
      } catch (err) {
        console.error('Error fetching subcategories:', err);
        setError('Không thể tải danh mục con. Vui lòng thử lại sau.');
        setSubcategories([]);
      } finally {
        setLoading(false);
        setTimeout(() => {
          isProcessingRef.current = false;
        }, 300);
      }
    };
    
    fetchSubcategoriesData();
    
    // Cleanup khi unmount
    return () => {
      isProcessingRef.current = false;
    };
  }, [rootCategoryId, memoizedFetchSubcategories, memoizedGetCache]);
  
  // Reset hasFetched khi rootCategoryId thay đổi
  useEffect(() => {
    if (rootCategoryId !== prevRootCategoryIdRef.current) {
      hasFetchedRef.current = false;
    }
  }, [rootCategoryId]);
  
  // Lọc subcategories theo search term
  const filteredSubcategories = searchTerm 
    ? subcategories.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : subcategories;
    
  // Xử lý khi click vào subcategory
  const handleSubcategoryClick = (subcategoryId) => {
    console.log('CategorySidebar: Subcategory selected', subcategoryId);
    onSubcategorySelect(subcategoryId);
  };
  
  // Xử lý khi áp dụng lọc giá
  const handlePriceFilter = () => {
    // Thực hiện lọc giá nếu có callback
    console.log('CategorySidebar: Applying price filter', { minPrice, maxPrice });
  };
  
  // Render component
  return (
    <SidebarContainer>
      <SidebarHeader>
        <h3>
          <FaShoppingBasket /> Danh mục sản phẩm
        </h3>
      </SidebarHeader>
      
      <SidebarContent>
        <SearchBox>
          <input 
            type="text"
            placeholder="Tìm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch />
        </SearchBox>
        
        {loading ? (
          <LoadingState>Đang tải danh mục...</LoadingState>
        ) : error ? (
          <ErrorState>{error}</ErrorState>
        ) : filteredSubcategories.length > 0 ? (
          <CategoryList>
            {filteredSubcategories.map(category => (
              <CategoryItem key={category.category_id}>
                <CategoryLink 
                  to="#"
                  active={selectedSubcategory === category.category_id ? 1 : 0}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubcategoryClick(category.category_id);
                  }}
                >
                  {category.name}
                </CategoryLink>
              </CategoryItem>
            ))}
          </CategoryList>
        ) : (
          <LoadingState>Không có danh mục con</LoadingState>
        )}
      </SidebarContent>
      
      <PriceFilter>
        <h4>Lọc theo giá</h4>
        <div className="price-inputs">
          <input
            type="number"
            placeholder="Giá tối thiểu"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min="0"
          />
          <input
            type="number"
            placeholder="Giá tối đa"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min={minPrice || "0"}
          />
        </div>
        <button onClick={handlePriceFilter}>
          Áp dụng lọc giá
        </button>
      </PriceFilter>
    </SidebarContainer>
  );
};

export default CategorySidebar; 