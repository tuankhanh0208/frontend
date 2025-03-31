// src/components/category/CategorySidebar/CategorySidebar.js
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';
import productService from '../../../services/productService';
import mockService from '../../../services/mockService';

const SidebarContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const SidebarHeader = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  
  h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
    display: flex;
    align-items: center;
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
  
  &:hover {
    background-color: #f9f9f9;
    color: #4CAF50;
  }
  
  .count {
    color: #999;
    font-size: 12px;
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
  transition: max-height 0.3s ease;
`;

const SubcategoryItem = styled.li``;

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
  
  h4 {
    margin: 0 0 15px;
    font-size: 16px;
    color: #333;
  }
  
  .range-inputs {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
    
    input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      
      &:focus {
        outline: none;
        border-color: #4CAF50;
      }
    }
  }
  
  .filter-button {
    width: 100%;
    padding: 8px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: #388E3C;
    }
  }
`;

const CategorySidebar = ({ onFilterChange }) => {
  const { id: categoryId } = useParams();
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // const data = await productService.getCategories();
        const data = await mockService.getCategories();
        console.log('Fetched categories:', data);
        
        // Add subcategories to the categories (sample data)
        const categoriesWithSubs = data.map(category => ({
          ...category,
          subcategories: generateSubcategories(category)
        }));
        
        setCategories(categoriesWithSubs);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  const generateSubcategories = (category) => {
    if (category.id === 1) { // Thịt heo
      return [
        { id: 101, name: "Ba chỉ heo", slug: "ba-chi-heo", count: 12 },
        { id: 102, name: "Thịt đùi", slug: "thit-dui", count: 8 },
        { id: 103, name: "Sườn heo", slug: "suon-heo", count: 10 },
        { id: 104, name: "Nạc vai", slug: "nac-vai", count: 6 }
      ];
    } else if (category.id === 2) { // Thịt bò
      return [
        { id: 201, name: "Thăn bò", slug: "than-bo", count: 9 },
        { id: 202, name: "Bắp bò", slug: "bap-bo", count: 7 },
        { id: 203, name: "Gầu bò", slug: "gau-bo", count: 5 }
      ];
    } else if (category.id === 3) { // Cá, hải sản
      return [
        { id: 301, name: "Cá hồi", slug: "ca-hoi", count: 6 },
        { id: 302, name: "Tôm sú", slug: "tom-su", count: 8 },
        { id: 303, name: "Cá thu", slug: "ca-thu", count: 4 },
        { id: 304, name: "Mực", slug: "muc", count: 5 }
      ];
    }
    
    return [];
  };
  
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handlePriceFilter = () => {
    if (onFilterChange) {
      onFilterChange({
        minPrice: minPrice ? parseInt(minPrice) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice) : undefined
      });
    }
  };
  
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <SidebarContainer>
      <SidebarHeader>
        <h3>Danh mục sản phẩm</h3>
      </SidebarHeader>
      
      <SidebarContent>
        <SearchBox>
          <FaSearch />
          <input 
            type="text" 
            placeholder="Tìm danh mục..." 
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </SearchBox>
        
        <CategoryList>
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải...</div>
          ) : filteredCategories.length > 0 ? (
            filteredCategories.map(category => (
              <CategoryItem key={category.id}>
                <MainCategoryLink 
                  to={`/categories/${category.id}`}
                  active={category.id === Number(categoryId) ? 1 : 0}
                >
                  {category.name}
                  {category.subcategories?.length > 0 && (
                    <ToggleButton onClick={(e) => {
                      e.preventDefault();
                      toggleCategory(category.id);
                    }}>
                      {expandedCategories[category.id] ? <FaChevronUp /> : <FaChevronDown />}
                    </ToggleButton>
                  )}
                </MainCategoryLink>
                
                {category.subcategories?.length > 0 && (
                  <SubcategoryList expanded={expandedCategories[category.id]}>
                    {category.subcategories.map(subcategory => (
                      <SubcategoryItem key={subcategory.id}>
                        <SubcategoryLink 
                          to={`/categories/${category.id}/${subcategory.slug}`}
                          active={false}
                        >
                          {subcategory.name}
                          <span className="count">({subcategory.count})</span>
                        </SubcategoryLink>
                      </SubcategoryItem>
                    ))}
                  </SubcategoryList>
                )}
              </CategoryItem>
            ))
          ) : (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              Không tìm thấy danh mục nào
            </div>
          )}
        </CategoryList>
        
        <PriceFilter>
          <h4>Lọc theo giá</h4>
          <div className="range-inputs">
            <input 
              type="number" 
              placeholder="Từ"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input 
              type="number" 
              placeholder="Đến"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <button className="filter-button" onClick={handlePriceFilter}>
            Áp dụng
          </button>
        </PriceFilter>
      </SidebarContent>
    </SidebarContainer>
  );
};

export default CategorySidebar;