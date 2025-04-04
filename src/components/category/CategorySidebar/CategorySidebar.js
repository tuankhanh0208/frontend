// src/components/category/CategorySidebar/CategorySidebar.js
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaChevronDown, FaChevronUp, FaSearch, FaShoppingBasket } from 'react-icons/fa';
import productService from '../../../services/productService';

const SidebarContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  
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
    transition: all 0.3s ease;
    
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
    transition: color 0.3s ease;
  }
  
  &:hover svg {
    color: #4CAF50;
  }
`;

const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  animation: fadeIn 0.5s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const CategoryItem = styled.li`
  border-bottom: 1px solid #f5f5f5;
  transition: all 0.3s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: rgba(76, 175, 80, 0.05);
  }
`;

const CategoryLink = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  color: #333;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: ${props => props.active ? '600' : 'normal'};
  background-color: ${props => props.active ? 'rgba(76, 175, 80, 0.1)' : 'transparent'};
  border-left: ${props => props.active ? '3px solid #4CAF50' : '3px solid transparent'};
  
  &:hover {
    background-color: #f9f9f9;
    color: #4CAF50;
    border-left: 3px solid #4CAF50;
    transform: translateX(2px);
  }
  
  .count {
    color: #999;
    font-size: 12px;
    background-color: #f0f0f0;
    padding: 2px 6px;
    border-radius: 10px;
  }
`;

const MainCategoryLink = styled(CategoryLink)`
  font-weight: 500;
`;

const SubcategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: ${props => props.expanded ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease, opacity 0.3s ease;
  opacity: ${props => props.expanded ? '1' : '0'};
`;

const SubcategoryItem = styled.li`
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(76, 175, 80, 0.05);
  }
`;

const SubcategoryLink = styled(Link)`
  display: block;
  padding: 10px 20px 10px 35px;
  color: #666;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: ${props => props.active ? '600' : 'normal'};
  background-color: ${props => props.active ? 'rgba(76, 175, 80, 0.05)' : 'transparent'};
  
  &:hover {
    background-color: #f9f9f9;
    color: #4CAF50;
  }
  
  &::before {
    content: '•';
    margin-right: 8px;
  }
  
  .count {
    color: #999;
    font-size: 12px;
    float: right;
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #4CAF50;
  }
`;

const PriceFilter = styled.div`
  padding: 15px 20px;
  border-top: 1px solid #eee;
  background-color: #f8f8f8;
  margin-top: 10px;
  
  h4 {
    margin: 0 0 15px;
    font-size: 16px;
    color: #333;
    display: flex;
    align-items: center;
    
    &:before {
      content: '₫';
      margin-right: 8px;
      color: #4CAF50;
      font-weight: bold;
    }
  }
  
  .range-inputs {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
    width: 100%;
    
    input {
      flex: 0 0 calc(50% - 5px);
      padding: 8px 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      transition: all 0.3s ease;
      min-width: 0;
      box-sizing: border-box;
      height: 40px;
      
      &:focus {
        outline: none;
        border-color: #4CAF50;
        box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
      }
      
      &::placeholder {
        color: #aaa;
      }
    }
  }
  
  .filter-button {
    width: 100%;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
    height: 40px;
    
    &:hover {
      background-color: #388E3C;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: none;
    }
  }
`;

const CategorySidebar = ({ categoryId, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [rootCategoryId, setRootCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Lấy và lưu trữ rootCategoryId khi component mount lần đầu
  useEffect(() => {
    // Chỉ cập nhật rootCategoryId khi chưa có giá trị
    if (!rootCategoryId && id) {
      setRootCategoryId(id);
    }
  }, [id, rootCategoryId]);
  
  // Lấy subcategories của category gốc
  useEffect(() => {
    // Chỉ fetch dữ liệu khi có rootCategoryId
    if (rootCategoryId) {
      const fetchSubcategories = async () => {
        try {
          setLoading(true);
          // Luôn lấy subcategories của category gốc, không phải subcategory hiện tại
          const data = await productService.getSubcategories(rootCategoryId);
          setSubcategories(data);
        } catch (error) {
          console.error('Failed to fetch subcategories:', error);
          setSubcategories([]);
        } finally {
          setLoading(false);
        }
      };
      
      fetchSubcategories();
    }
  }, [rootCategoryId]);
  
  // Apply price filter
  const applyPriceFilter = () => {
    onFilterChange({
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined
    });
  };
  
  // Filter subcategories by search term
  const filteredSubcategories = searchTerm
    ? subcategories.filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : subcategories;
  
  return (
    <SidebarContainer>
      <SidebarHeader>
        <h3>
          <FaShoppingBasket /> Danh mục sản phẩm
        </h3>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Search box for categories */}
        <SearchBox>
          <input 
            type="text"
            placeholder="Tìm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch />
        </SearchBox>
        
        {/* Categories list */}
        {loading ? (
          <div style={{ padding: '15px 20px', textAlign: 'center' }}>Đang tải...</div>
        ) : filteredSubcategories.length > 0 ? (
          <CategoryList>
            {filteredSubcategories.map(category => (
              <CategoryItem key={category.category_id}>
                <CategoryLink 
                  to={`/categories/${category.category_id}`}
                  active={parseInt(id) === category.category_id ? 1 : 0}
                >
                  {category.name}
                </CategoryLink>
              </CategoryItem>
            ))}
          </CategoryList>
        ) : (
          <div style={{ padding: '15px 20px', color: '#666' }}>
            Không có danh mục con
          </div>
        )}
      </SidebarContent>
      
      {/* Price filter */}
      <PriceFilter>
        <h4>Lọc theo giá</h4>
        <div className="range-inputs">
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
        <button 
          className="filter-button"
          onClick={applyPriceFilter}
        >
          Áp dụng lọc giá
        </button>
      </PriceFilter>
    </SidebarContainer>
  );
};

export default CategorySidebar;