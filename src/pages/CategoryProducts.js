// src/pages/CategoryProducts.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaAngleRight } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import CategoryProductItem from '../components/category/CategoryProductItem/CategoryProductItem';
import Pagination from '../components/common/Pagination/Pagination';
import CategorySidebar from '../components/category/CategorySidebar/CategorySidebar';
import mockService from '../services/mockService';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

// Trong CategorySidebar.js, thêm border đỏ để dễ nhìn
const SidebarContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 2px solid red; /* Thêm border đỏ để dễ nhìn */
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
        const categoryData = await mockService.getCategoryById(id);
        setCategory(categoryData);
        
        // Fetch products for this category with filters
        const productData = await mockService.getProducts({
          category: id,
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