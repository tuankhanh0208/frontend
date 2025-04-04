// src/pages/CategoryProducts.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
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

// Thêm styled component cho URL
const CategoryURL = styled.div`
  color: #666;
  margin-bottom: 15px;
  font-size: 14px;
  
  a {
    color: #4CAF50;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

// Lấy category ID gốc từ URL
const getRootCategoryId = (pathname) => {
  // Lấy phần đầu tiên của route '/categories/X/...'
  const matches = pathname.match(/\/categories\/(\d+)/);
  if (matches && matches[1]) {
    return matches[1];
  }
  return null;
};

const CategoryProducts = () => {
  const { id } = useParams();
  const location = useLocation();
  const [category, setCategory] = useState(null);
  const [rootCategoryId, setRootCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    sort: 'newest',
    minPrice: undefined,
    maxPrice: undefined
  });
  
  // Xác định rootCategoryId khi component load lần đầu
  useEffect(() => {
    // Nếu đã có trong URL thì sử dụng, nếu không thì dùng id hiện tại
    const rootId = getRootCategoryId(location.pathname) || id;
    setRootCategoryId(rootId);
  }, [location.pathname, id]);
  
  // Lấy thông tin category từ ID
  useEffect(() => {
    const fetchCategoryInfo = async () => {
      try {
        const allCategories = await productService.getCategories();
        const categoryInfo = allCategories.find(c => c.category_id === parseInt(id));
        
        if (categoryInfo) {
          setCategory(categoryInfo);
        } else {
          setCategory({
            category_id: parseInt(id),
            name: 'Danh mục sản phẩm',
            description: 'Sản phẩm thuộc danh mục này'
          });
        }
      } catch (error) {
        console.error('Failed to fetch category info:', error);
      }
    };
    
    fetchCategoryInfo();
  }, [id]);
  
  // Lấy sản phẩm thuộc category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch products for this category with filters
        const productData = await productService.getProductsByCategory(id, {
          include_subcategories: false, // Chỉ lấy sản phẩm trực tiếp của category này
          page: currentPage,
          limit: 8,
          sort: filters.sort,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice
        });
        
        setProducts(productData);
        setTotalPages(Math.ceil(productData.length / 8) || 1);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
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
                {category ? category.name : 'Đang tải...'}
              </Link>
            </li>
          </ul>
        </BreadcrumbNav>
        
        <ContentContainer>
          <CategorySidebar 
            categoryId={rootCategoryId} 
            onFilterChange={handleFilterChange}
          />
          
          <MainContent>
            {category && (
              <CategoryHeader>
                <CategoryTitle>{category.name}</CategoryTitle>
                {/* <CategoryURL>
                  URL: <a href={`https://www.bachhoaxanh.com`} target="_blank" rel="noopener noreferrer">
                    https://www.bachhoaxanh.com/{category.name.toLowerCase().replace(/\s+/g, '-')}
                  </a>
                </CategoryURL> */}
                {/* <CategoryDescription>{category.description}</CategoryDescription> */}
              </CategoryHeader>
            )}
            
            <ProductsHeader>
              <ProductCount>
                Hiển thị {products.length} sản phẩm
              </ProductCount>
              <SortSelector 
                value={filters.sort} 
                onChange={handleSortChange}
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá: Thấp đến cao</option>
                <option value="price-desc">Giá: Cao đến thấp</option>
                <option value="name-asc">Tên: A-Z</option>
                <option value="name-desc">Tên: Z-A</option>
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
                      key={product.product_id} 
                      product={{
                        id: product.product_id,
                        name: product.name,
                        originalPrice: product.original_price,
                        discountPrice: product.discount_price,
                        discountPercent: product.discount_percent,
                        image: product.image_url,
                        rating: 4,
                        ratingCount: 10
                      }} 
                    />
                  ))}
                </ProductGrid>
                
                {totalPages > 1 && (
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <NoProducts>
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Không có sản phẩm nào trong danh mục này. Vui lòng thử danh mục khác.</p>
              </NoProducts>
            )}
          </MainContent>
        </ContentContainer>
      </PageContainer>
    </MainLayout>
  );
};

export default CategoryProducts;