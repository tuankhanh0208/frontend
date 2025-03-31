# Triển Khai Giao Diện Danh Mục Sản Phẩm

## 1. Sidebar Danh Mục

Thành phần sidebar hiển thị cấu trúc phân cấp danh mục, cho phép lọc sản phẩm theo danh mục và giá.

```javascript
// src/components/category/CategorySidebar/CategorySidebar.js
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';
import productService from '../../../services/productService';

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
        const data = await productService.getCategories();
        
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
```

## 2. Trang Danh Mục Sản Phẩm

Trang hiển thị danh sách sản phẩm theo danh mục, hỗ trợ phân trang và sắp xếp.

```javascript
// src/pages/CategoryProducts.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaAngleRight } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import CategoryProductItem from '../components/category/CategoryProductItem/CategoryProductItem';
import Pagination from '../components/common/Pagination/Pagination';
import CategorySidebar from '../components/category/CategorySidebar/CategorySidebar';
import productService from '../services/productService';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const BreadcrumbNav = styled.nav`
  margin-bottom: 20px;
  
  ul {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    align-items: center;
    flex-wrap: wrap;
    
    li {
      display: flex;
      align-items: center;
      
      &:not(:last-child)::after {
        content: '';
        margin: 0 8px;
        display: flex;
        align-items: center;
      }
      
      a {
        color: #666;
        text-decoration: none;
        display: flex;
        align-items: center;
        
        &:hover {
          color: #4CAF50;
        }
      }
      
      &:last-child a {
        color: #333;
        font-weight: 500;
        pointer-events: none;
      }
    }
  }
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  animation: fadeIn 0.5s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const CategoryHeader = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const CategoryTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
`;

const CategoryDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin: 0;
`;

const ProductsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 15px 20px;
  margin-bottom: 20px;
`;

const ProductCount = styled.div`
  color: #666;
  font-size: 14px;
`;

const SortSelector = styled.select`
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  color: #333;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const NoProducts = styled.div`
  text-align: center;
  padding: 50px 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  h3 {
    margin: 0 0 10px;
    color: #333;
  }
  
  p {
    color: #666;
    margin: 0;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 0;
  color: #4CAF50;
  font-size: 18px;
`;

const CategoryProducts = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    sort: 'newest',
    minPrice: undefined,
    maxPrice: undefined
  });
  
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        
        // Fetch category details
        const categoryData = await productService.getCategoryById(id);
        setCategory(categoryData);
        
        // Fetch products for this category with filters
        const productData = await productService.getProductsByCategory(id, {
          page: currentPage,
          limit: 8,
          sort: filters.sort,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice
        });
        
        setProducts(productData.products);
        setTotalPages(productData.totalPages);
      } catch (error) {
        console.error('Failed to fetch category data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategoryData();
  }, [id, currentPage, filters]);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  const handleSortChange = (e) => {
    setFilters({
      ...filters,
      sort: e.target.value
    });
    setCurrentPage(1);
  };
  
  const handleFilterChange = (newFilters) => {
    setFilters({
      ...filters,
      ...newFilters
    });
    setCurrentPage(1);
  };
  
  return (
    <MainLayout>
      <PageContainer>
        <BreadcrumbNav>
          <ul>
            <li>
              <Link to="/">
                <FaHome /> Trang chủ
              </Link>
              <FaAngleRight />
            </li>
            <li>
              <Link to="/categories">
                Các loại thực phẩm
              </Link>
              <FaAngleRight />
            </li>
            <li>
              <Link to={`/categories/${id}`}>
                {category?.name || 'Danh mục sản phẩm'}
              </Link>
            </li>
          </ul>
        </BreadcrumbNav>
        
        <ContentContainer>
          <CategorySidebar onFilterChange={handleFilterChange} />
          
          <MainContent>
            {loading && !category ? (
              <LoadingSpinner>
                Đang tải danh mục sản phẩm...
              </LoadingSpinner>
            ) : (
              <>
                <CategoryHeader>
                  <CategoryTitle>{category?.name}</CategoryTitle>
                  <CategoryDescription>{category?.description}</CategoryDescription>
                </CategoryHeader>
                
                <ProductsHeader>
                  <ProductCount>
                    {products?.length > 0 
                      ? `Hiển thị ${products.length} sản phẩm`
                      : 'Không có sản phẩm nào'
                    }
                  </ProductCount>
                  
                  <SortSelector value={filters.sort} onChange={handleSortChange}>
                    <option value="newest">Mới nhất</option>
                    <option value="price-asc">Giá: Thấp đến cao</option>
                    <option value="price-desc">Giá: Cao đến thấp</option>
                    <option value="rating">Đánh giá cao nhất</option>
                  </SortSelector>
                </ProductsHeader>
                
                {loading ? (
                  <LoadingSpinner>
                    Đang tải sản phẩm...
                  </LoadingSpinner>
                ) : products.length > 0 ? (
                  <>
                    <ProductGrid>
                      {products.map(product => (
                        <CategoryProductItem 
                          key={product.id} 
                          product={product}
                        />
                      ))}
                    </ProductGrid>
                    
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </>
                ) : (
                  <NoProducts>
                    <h3>Không tìm thấy sản phẩm</h3>
                    <p>Vui lòng thử lại với bộ lọc khác hoặc xem các danh mục khác.</p>
                  </NoProducts>
                )}
              </>
            )}
          </MainContent>
        </ContentContainer>
      </PageContainer>
    </MainLayout>
  );
};

export default CategoryProducts;
```

## 3. Item Sản Phẩm Trong Danh Mục

Component hiển thị thông tin sản phẩm với các tùy chọn thêm vào giỏ hàng, wishlist.

```javascript
// src/components/category/CategoryProductItem/CategoryProductItem.js
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaStar, FaShoppingCart, FaHeart, FaEye } from 'react-icons/fa';
import { CartContext } from '../../../context/CartContext';

const Card = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  position: relative;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transform: translateY(-5px);
    
    .quick-actions {
      opacity: 1;
      transform: translateY(0);
    }
    
    .image-container img {
      transform: scale(1.05);
    }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 200px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #FF8C00;
  color: white;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  z-index: 2;
`;

const QuickActions = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.9);
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.3s ease;
  z-index: 2;
`;

const ActionButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: white;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #4CAF50;
    color: white;
    border-color: #4CAF50;
`;

const Title = styled.h3`
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  
  a {
    color: inherit;
    text-decoration: none;
    
    &:hover {
      color: #4CAF50;
    }
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  
  svg {
    color: #FFD700;
    margin-right: 2px;
    font-size: 14px;
  }
  
  span {
    color: #666;
    font-size: 14px;
    margin-left: 5px;
  }
`;

const Price = styled.div`
  display: flex;
  align-items: center;
  margin-top: auto;
  
  .current {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
  
  .original {
    margin-left: 10px;
    font-size: 14px;
    color: #999;
    text-decoration: line-through;
  }
`;

const AddToCartButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  margin-top: 15px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background-color: #388E3C;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const CategoryProductItem = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const [inWishlist, setInWishlist] = useState(false);
  
  const handleAddToCart = () => {
    addToCart(product, 1);
  };
  
  const toggleWishlist = () => {
    setInWishlist(!inWishlist);
    // Here you would implement actual wishlist functionality
  };
  
  const discountPercentage = product.discountPrice 
    ? Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100) 
    : 0;
  
  return (
    <Card>
      <ImageContainer className="image-container">
        <Link to={`/products/${product.id}`}>
          <img src={product.images[0]} alt={product.name} />
        </Link>
        
        {discountPercentage > 0 && (
          <DiscountBadge>{discountPercentage}% OFF</DiscountBadge>
        )}
        
        <QuickActions className="quick-actions">
          <WishlistButton 
            className={inWishlist ? 'active' : ''} 
            onClick={toggleWishlist} 
            aria-label="Add to wishlist"
          >
            <FaHeart />
          </WishlistButton>
          
          <ActionButton as={Link} to={`/products/${product.id}`} aria-label="View product">
            <FaEye />
          </ActionButton>
        </QuickActions>
      </ImageContainer>
      
      <Content>
        <Title>
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </Title>
        
        <Rating>
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} color={i < Math.floor(product.rating) ? "#FFD700" : "#e4e5e9"} />
          ))}
          <span>({product.reviewCount})</span>
        </Rating>
        
        <Price>
          <span className="current">{product.discountPrice || product.originalPrice}đ</span>
          {product.discountPrice && (
            <span className="original">{product.originalPrice}đ</span>
          )}
        </Price>
        
        <AddToCartButton 
          onClick={handleAddToCart} 
          disabled={!product.inStock}
        >
          <FaShoppingCart /> Thêm vào giỏ hàng
        </AddToCartButton>
      </Content>
    </Card>
  );
};

export default CategoryProductItem;

// src/pages/CategoryProducts.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaAngleRight } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import CategoryProductItem from '../components/category/CategoryProductItem/CategoryProductItem';
import Pagination from '../components/common/Pagination/Pagination';
import CategorySidebar from '../components/category/CategorySidebar/CategorySidebar';
import productService from '../services/productService';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const BreadcrumbNav = styled.nav`
  margin-bottom: 20px;
  
  ul {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    align-items: center;
    flex-wrap: wrap;
    
    li {
      display: flex;
      align-items: center;
      
      &:not(:last-child)::after {
        content: '';
        margin: 0 8px;
        display: flex;
        align-items: center;
      }
      
      a {
        color: #666;
        text-decoration: none;
        display: flex;
        align-items: center;
        
        &:hover {
          color: #4CAF50;
        }
      }
      
      &:last-child a {
        color: #333;
        font-weight: 500;
        pointer-events: none;
      }
    }
  }
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  animation: fadeIn 0.5s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const CategoryHeader = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const CategoryTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
`;

const CategoryDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin: 0;
`;

const ProductsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 15px 20px;
  margin-bottom: 20px;
`;

const ProductCount = styled.div`
  color: #666;
  font-size: 14px;
`;

const SortSelector = styled.select`
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  color: #333;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const NoProducts = styled.div`
  text-align: center;
  padding: 50px 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  h3 {
    margin: 0 0 10px;
    color: #333;
  }
  
  p {
    color: #666;
    margin: 0;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 0;
  color: #4CAF50;
  font-size: 18px;
`;

const CategoryProducts = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    sort: 'newest',
    minPrice: undefined,
    maxPrice: undefined
  });
  
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        
        // Fetch category details
        const categoryData = await productService.getCategoryById(id);
        setCategory(categoryData);
        
        // Fetch products for this category with filters
        const productData = await productService.getProductsByCategory(id, {
          page: currentPage,
          limit: 8,
          sort: filters.sort,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice
        });
        
        setProducts(productData.products);
        setTotalPages(productData.totalPages);
      } catch (error) {
        console.error('Failed to fetch category data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategoryData();
  }, [id, currentPage, filters]);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  const handleSortChange = (e) => {
    setFilters({
      ...filters,
      sort: e.target.value
    });
    setCurrentPage(1);
  };
  
  const handleFilterChange = (newFilters) => {
    setFilters({
      ...filters,
      ...newFilters
    });
    setCurrentPage(1);
  };
  
  return (
    <MainLayout>
      <PageContainer>
        <BreadcrumbNav>
          <ul>
            <li>
              <Link to="/">
                <FaHome /> Trang chủ
              </Link>
              <FaAngleRight />
            </li>
            <li>
              <Link to="/categories">
                Các loại thực phẩm
              </Link>
              <FaAngleRight />
            </li>
            <li>
              <Link to={`/categories/${id}`}>
                {category?.name || 'Danh mục sản phẩm'}
              </Link>
            </li>
          </ul>
        </BreadcrumbNav>
        
        <ContentContainer>
          <CategorySidebar onFilterChange={handleFilterChange} />
          
          <MainContent>
            {loading && !category ? (
              <LoadingSpinner>
                Đang tải danh mục sản phẩm...
              </LoadingSpinner>
            ) : (
              <>
                <CategoryHeader>
                  <CategoryTitle>{category?.name}</CategoryTitle>
                  <CategoryDescription>{category?.description}</CategoryDescription>
                </CategoryHeader>
                
                <ProductsHeader>
                  <ProductCount>
                    {products?.length > 0 
                      ? `Hiển thị ${products.length} sản phẩm`
                      : 'Không có sản phẩm nào'
                    }
                  </ProductCount>
                  
                  <SortSelector value={filters.sort} onChange={handleSortChange}>
                    <option value="newest">Mới nhất</option>
                    <option value="price-asc">Giá: Thấp đến cao</option>
                    <option value="price-desc">Giá: Cao đến thấp</option>
                    <option value="rating">Đánh giá cao nhất</option>
                  </SortSelector>
                </ProductsHeader>
                
                {loading ? (
                  <LoadingSpinner>
                    Đang tải sản phẩm...
                  </LoadingSpinner>
                ) : products.length > 0 ? (
                  <>
                    <ProductGrid>
                      {products.map(product => (
                        <CategoryProductItem 
                          key={product.id} 
                          product={product}
                        />
                      ))}
                    </ProductGrid>
                    
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </>
                ) : (
                  <NoProducts>
                    <h3>Không tìm thấy sản phẩm</h3>
                    <p>Vui lòng thử lại với bộ lọc khác hoặc xem các danh mục khác.</p>
                  </NoProducts>
                )}
              </>
            )}
          </MainContent>
        </ContentContainer>
      </PageContainer>
    </MainLayout>
  );
};

export default CategoryProducts;

// src/pages/CategoryProducts.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaAngleRight } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import CategoryProductItem from '../components/category/CategoryProductItem/CategoryProductItem';
import Pagination from '../components/common/Pagination/Pagination';
import CategorySidebar from '../components/category/CategorySidebar/CategorySidebar';
import productService from '../services/productService';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const BreadcrumbNav = styled.nav`
  margin-bottom: 20px;
  
  ul {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    align-items: center;
    flex-wrap: wrap;
    
    li {
      display: flex;
      align-items: center;
      
      &:not(:last-child)::after {
        content: '';
        margin: 0 8px;
        display: flex;
        align-items: center;
      }
      
      a {
        color: #666;
        text-decoration: none;
        display: flex;
        align-items: center;
        
        &:hover {
          color: #4CAF50;
        }
      }
      
      &:last-child a {
        color: #333;
        font-weight: 500;
        pointer-events: none;
      }
    }
  }
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  animation: fadeIn 0.5s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const CategoryHeader = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const CategoryTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
`;

const CategoryDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin: 0;
`;

const ProductsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 15px 20px;
  margin-bottom: 20px;
`;

const ProductCount = styled.div`
  color: #666;
  font-size: 14px;
`;

const SortSelector = styled.select`
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  color: #333;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const NoProducts = styled.div`
  text-align: center;
  padding: 50px 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  h3 {
    margin: 0 0 10px;
    color: #333;
  }
  
  p {
    color: #666;
    margin: 0;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 0;
  color: #4CAF50;
  font-size: 18px;
`;

const CategoryProducts = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    sort: 'newest',
    minPrice: undefined,
    maxPrice: undefined
  });
  
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        
        // Fetch category details
        const categoryData = await productService.getCategoryById(id);
        setCategory(categoryData);
        
        // Fetch products for this category with filters
        const productData = await productService.getProductsByCategory(id, {
          page: currentPage,
          limit: 8,
          sort: filters.sort,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice
        });
        
        setProducts(productData.products);
        setTotalPages(productData.totalPages);
      } catch (error) {
        console.error('Failed to fetch category data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategoryData();
  }, [id, currentPage, filters]);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  const handleSortChange = (e) => {
    setFilters({
      ...filters,
      sort: e.target.value
    });
    setCurrentPage(1);
  };
  
  const handleFilterChange = (newFilters) => {
    setFilters({
      ...filters,
      ...newFilters
    });
    setCurrentPage(1);
  };
  
  return (
    <MainLayout>
      <PageContainer>
        <BreadcrumbNav>
          <ul>
            <li>
              <Link to="/">
                <FaHome /> Trang chủ
              </Link>
              <FaAngleRight />
            </li>
            <li>
              <Link to="/categories">
                Các loại thực phẩm
              </Link>
              <FaAngleRight />
            </li>
            <li>
              <Link to={`/categories/${id}`}>
                {category?.name || 'Danh mục sản phẩm'}
              </Link>
            </li>
          </ul>
        </BreadcrumbNav>
        
        <ContentContainer>
          <CategorySidebar onFilterChange={handleFilterChange} />
          
          <MainContent>
            {loading && !category ? (
              <LoadingSpinner>
                Đang tải danh mục sản phẩm...
              </LoadingSpinner>
            ) : (
              <>
                <CategoryHeader>
                  <CategoryTitle>{category?.name}</CategoryTitle>
                  <CategoryDescription>{category?.description}</CategoryDescription>
                </CategoryHeader>
                
                <ProductsHeader>
                  <ProductCount>
                    {products?.length > 0 
                      ? `Hiển thị ${products.length} sản phẩm`
                      : 'Không có sản phẩm nào'
                    }
                  </ProductCount>
                  
                  <SortSelector value={filters.sort} onChange={handleSortChange}>
                    <option value="newest">Mới nhất</option>
                    <option value="price-asc">Giá: Thấp đến cao</option>
                    <option value="price-desc">Giá: Cao đến thấp</option>
                    <option value="rating">Đánh giá cao nhất</option>
                  </SortSelector>
                </ProductsHeader>
                
                {loading ? (
                  <LoadingSpinner>
                    Đang tải sản phẩm...
                  </LoadingSpinner>
                ) : products.length > 0 ? (
                  <>
                    <ProductGrid>
                      {products.map(product => (
                        <CategoryProductItem 
                          key={product.id} 
                          product={product}
                        />
                      ))}
                    </ProductGrid>
                    
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </>
                ) : (
                  <NoProducts>
                    <h3>Không tìm thấy sản phẩm</h3>
                    <p>Vui lòng thử lại với bộ lọc khác hoặc xem các danh mục khác.</p>
                  </NoProducts>
                )}
              </>
            )}
          </MainContent>
        </ContentContainer>
      </PageContainer>
    </MainLayout>
  );
};

export default CategoryProducts;

// Update these routes in src/App.js

// Find the routes section and update/add these routes:

{/* Public Routes */}
<Route path="/" element={<Home />} />
<Route path="/products/:id" element={<ProductDetail />} />
<Route path="/categories" element={<CategoryList />} />
<Route path="/categories/:id" element={<CategoryProducts />} />
<Route path="/categories/:id/:subCategory" element={<CategoryProducts />} />
<Route path="/search" element={<SearchResults />} />
<Route path="/cart" element={<Cart />} />