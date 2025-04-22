// src/components/category/CategorySidebar/CategorySidebar.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaChevronDown, FaChevronUp, FaSearch, FaShoppingBasket, FaAngleRight, FaAngleDown } from 'react-icons/fa';
import productService from '../../../services/productService';
import { useCategory } from '../../../context/CategoryContext';

/**
 * CategorySidebar Component
 * 
 * Component này hiển thị danh mục con của danh mục hiện tại.
 * Sử dụng CategoryContext để lưu trữ và truy xuất dữ liệu danh mục,
 * thay vì sử dụng localStorage. Điều này giúp:
 * 
 * 1. Dữ liệu được lưu trữ trong bộ nhớ, không phụ thuộc vào localStorage
 * 2. Dữ liệu chỉ được gọi API một lần cho mỗi danh mục, sau đó được cache
 * 3. Khi quay lại từ trang sản phẩm, danh mục con vẫn được hiển thị ngay lập tức 
 *    mà không cần gọi lại API
 * 4. Không lưu trữ dữ liệu nhạy cảm ở localStorage
 */

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
  const [originalParentId, setOriginalParentId] = useState(null); // Lưu trữ category gốc
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State và ref để tự động chọn subcategory đầu tiên
  const [hasAutoSelected, setHasAutoSelected] = useState({});
  const isAutoSelectingRef = useRef(false);
  const autoSelectTimeoutRef = useRef(null);
  const firstLoadRef = useRef(true);
  
  // Refs để theo dõi các giá trị trước đó và tránh re-render không cần thiết
  const prevCategoryIdRef = useRef(categoryId);
  const prevRootCategoryIdRef = useRef(rootCategoryId);
  const hasFetchedRef = useRef(false);
  const processingRef = useRef(false);
  
  // Sử dụng context thay vì localStorage
  const { 
    fetchSubcategories, 
    getSubcategoriesFromCache, 
    isLoading: contextLoading,
    setSelectedSubcategory,
    getSelectedSubcategory,
    isNavigatingBack,
    setNavigatingBackStatus
  } = useCategory();
  
  // Memoize các hàm callback để tránh re-renders không cần thiết
  const memoizedFetchSubcategories = useCallback((catId, force) => {
    return fetchSubcategories(catId, force);
  }, [fetchSubcategories]);
  
  const memoizedGetCache = useCallback((catId) => {
    return getSubcategoriesFromCache(catId);
  }, [getSubcategoriesFromCache]);

  // Kiểm tra dữ liệu ngay khi component mount
  useEffect(() => {
    const checkForExistingData = () => {
      // Chỉ thực hiện nếu có categoryId và đang không có dữ liệu
      if (categoryId && subcategories.length === 0 && !hasFetchedRef.current) {
        console.log('CategorySidebar: Initial check for existing data for categoryId', categoryId);
        
        // Kiểm tra trong context cache
        const contextData = memoizedGetCache(categoryId);
        
        if (contextData && contextData.length > 0) {
          console.log('CategorySidebar: Using initial context data', contextData.length, 'items');
          setSubcategories(contextData);
          hasFetchedRef.current = true;
          setLoading(false);
          return;
        }
        
        // Kiểm tra trong localStorage
        try {
          const localData = localStorage.getItem(`subcategories_${categoryId}`);
          if (localData) {
            const parsedData = JSON.parse(localData);
            if (parsedData && parsedData.length > 0) {
              console.log('CategorySidebar: Using initial localStorage data', parsedData.length, 'items');
              setSubcategories(parsedData);
              hasFetchedRef.current = true;
              setLoading(false);
              return;
            }
          }
        } catch (error) {
          console.error('Error checking localStorage:', error);
        }
      }
    };
    
    checkForExistingData();
  }, [categoryId, memoizedGetCache, subcategories.length]);
  
  // Lưu trữ categoryId gốc khi component mount lần đầu
  useEffect(() => {
    // Chỉ cập nhật nếu originalParentId chưa được thiết lập và categoryId thay đổi
    if (!originalParentId && categoryId && categoryId !== prevCategoryIdRef.current) {
      console.log('CategorySidebar: Setting originalParentId to', categoryId);
      setOriginalParentId(categoryId);
      prevCategoryIdRef.current = categoryId;
    }
  }, [categoryId, originalParentId]);
  
  // Lấy và lưu trữ rootCategoryId khi component mount hoặc khi id/categoryId thay đổi
  useEffect(() => {
    // Ưu tiên sử dụng originalParentId để đảm bảo hiển thị danh mục con của danh mục gốc
    const currentId = originalParentId || categoryId || id;
    
    // Chỉ cập nhật khi currentId thay đổi để tránh re-renders không cần thiết
    if (currentId && currentId !== prevRootCategoryIdRef.current) {
      console.log('CategorySidebar: rootCategoryId set to', currentId);
      setRootCategoryId(currentId);
      prevRootCategoryIdRef.current = currentId;
    }
  }, [id, categoryId, originalParentId]);
  
  // Lấy subcategories của category gốc từ context
  useEffect(() => {
    // Ngăn chặn xử lý nếu đang trong quá trình fetch
    if (processingRef.current) {
      return;
    }
    
    // Debug để theo dõi các giá trị quan trọng
    console.log('CategorySidebar: Debug values - ', {
      rootCategoryId,
      originalParentId,
      categoryId,
      id,
      'location.pathname': location.pathname,
      hasFetched: hasFetchedRef.current
    });
    
    // Kiểm tra nếu cần phải fetch lại danh mục con
    const isReturningFromProduct = location.state?.fromProduct;
    const isBrowserBack = location.action === 'POP';
    
    // Kiểm tra nếu đang trên trang danh mục và đến từ nút back/forward của trình duyệt
    const forceRefetch = isReturningFromProduct || 
                        rootCategoryId !== prevRootCategoryIdRef.current || 
                        location.key === 'default' ||
                        isBrowserBack;
    
    // Điều kiện fetch mở rộng để đảm bảo luôn có dữ liệu khi cần
    const shouldFetch = 
      rootCategoryId && 
      (!hasFetchedRef.current || forceRefetch || subcategories.length === 0) &&
      !processingRef.current;
      
    if (shouldFetch) {
      const getSubcategories = async () => {
        processingRef.current = true;
        
        try {
          setLoading(true);
          console.log('CategorySidebar: fetching subcategories for rootCategoryId', rootCategoryId, forceRefetch ? '(forced)' : '');
          
          // Kiểm tra nếu có subcategories trong localStorage đã lưu trước
          let localStorageKey = `subcategories_${rootCategoryId}`;
          let cachedData = null;
          
          try {
            const localData = localStorage.getItem(localStorageKey);
            if (localData) {
              cachedData = JSON.parse(localData);
              console.log('CategorySidebar: Found cached data in localStorage:', cachedData.length, 'items');
            }
          } catch (storageError) {
            console.error('Error accessing localStorage:', storageError);
          }
          
          // Kiểm tra từ cache context trước
          let data = memoizedGetCache(rootCategoryId);
          
          // Nếu không có trong context cache, lấy từ API
          if (!data || data.length === 0) {
            console.log('CategorySidebar: No data in context cache, fetching from API');
            // Sử dụng fetch có force nếu đang quay lại từ trang khác
            data = await memoizedFetchSubcategories(rootCategoryId, forceRefetch);
          } else {
            console.log('CategorySidebar: Using data from context cache:', data.length, 'items');
          }
          
          // Nếu không có dữ liệu từ API và có trong localStorage, sử dụng localStorage
          if ((!data || data.length === 0) && cachedData && cachedData.length > 0) {
            console.log('CategorySidebar: Using localStorage data because API returned empty');
            data = cachedData;
          }
          // Nếu không có dữ liệu và không có trong localStorage, thử fetch lại với force=true
          else if ((!data || data.length === 0) && !forceRefetch) {
            console.log('CategorySidebar: No data found, trying forced fetch');
            data = await memoizedFetchSubcategories(rootCategoryId, true);
          }
          
          console.log('CategorySidebar: final subcategories data', data);
          
          if (data && data.length > 0) {
            setSubcategories(data);
            
            // Lưu dữ liệu vào localStorage để có thể sử dụng khi refresh hoặc quay lại
            try {
              localStorage.setItem(localStorageKey, JSON.stringify(data));
              console.log('CategorySidebar: Saved subcategories to localStorage');
            } catch (storageError) {
              console.error('Error saving to localStorage:', storageError);
            }
          } else {
            console.warn('CategorySidebar: No subcategories found or empty array returned');
            setSubcategories([]);
          }
          
          // Đánh dấu đã fetch
          hasFetchedRef.current = true;
        } catch (error) {
          console.error('Failed to fetch subcategories:', error);
          setSubcategories([]);
        } finally {
          setLoading(false);
          setTimeout(() => {
            processingRef.current = false;
          }, 300); // Thêm timeout nhỏ để tránh xử lý liên tục
        }
      };
      
      getSubcategories();
    } else if (rootCategoryId && subcategories.length === 0 && !loading) {
      // Kiểm tra nếu không có subcategories nhưng có rootCategoryId, thử lấy từ cache
      const cachedData = memoizedGetCache(rootCategoryId);
      if (cachedData && cachedData.length > 0) {
        console.log('CategorySidebar: Using cached data for empty subcategories', cachedData.length, 'items');
        setSubcategories(cachedData);
      }
    }
    
    // Khi component unmount, reset các refs
    return () => {
      processingRef.current = false;
      if (autoSelectTimeoutRef.current) {
        clearTimeout(autoSelectTimeoutRef.current);
      }
    };
  }, [rootCategoryId, memoizedFetchSubcategories, memoizedGetCache, location]);
  
  // Reset hasFetched khi rootCategoryId thay đổi
  useEffect(() => {
    if (rootCategoryId !== prevRootCategoryIdRef.current) {
      hasFetchedRef.current = false;
    }
  }, [rootCategoryId]);
  
  // Thay thế useEffect tự động chọn subcategory đầu tiên
  useEffect(() => {
    // Chỉ fetch dữ liệu subcategories đầu tiên khi có category mới, không tự động chọn
    if (subcategories.length > 0 && categoryId && !loading) {
      // Kiểm tra xem người dùng có đang quay lại từ trang khác không
      const isBrowserBack = location.state?.isBack || location.action === 'POP';
      
      // Cập nhật trạng thái điều hướng trong context
      setNavigatingBackStatus(isBrowserBack);
      
      // Nếu người dùng đang quay lại, không làm gì cả để giữ nguyên trạng thái hiện tại
      if (isBrowserBack) {
        console.log('CategorySidebar: Người dùng đang quay lại, giữ nguyên trạng thái subcategories');
        return;
      }
      
      // Nếu không phải đang quay lại, đảm bảo đã fetch dữ liệu nhưng không tự động chọn
      if (!isAutoSelectingRef.current && (!hasAutoSelected[categoryId] || firstLoadRef.current)) {
        console.log('CategorySidebar: Đã fetch dữ liệu subcategories cho category', categoryId);
        firstLoadRef.current = false;
        
        // Đánh dấu đã xử lý cho category này
        setHasAutoSelected(prev => ({
          ...prev,
          [categoryId]: true
        }));
      }
    }
  }, [subcategories, categoryId, loading, location, setNavigatingBackStatus, hasAutoSelected]);
  
  // Sử dụng MCP để theo dõi lỗi trình duyệt
  useEffect(() => {
    // Theo dõi lỗi trình duyệt
    const handleError = (event) => {
      console.error('Lỗi trình duyệt:', event.message);
      // Ghi log lỗi cho debug
      try {
        const errorLog = {
          message: event.message,
          source: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error?.stack || 'Unknown',
          timestamp: new Date().toISOString()
        };
        console.error('Chi tiết lỗi:', errorLog);
        
        // Reset trạng thái nếu có lỗi liên quan đến việc tự động chọn
        if (event.message.includes('navigate') || event.message.includes('subcategor')) {
          isAutoSelectingRef.current = false;
          processingRef.current = false;
        }
      } catch (logError) {
        console.error('Lỗi khi ghi log:', logError);
      }
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);
  
  // Kiểm tra nếu đang quay lại từ trang sản phẩm
  useEffect(() => {
    const isReturningFromProduct = location.state?.fromProduct;
    const isBrowserBack = location.action === 'POP';
    
    if (isReturningFromProduct || isBrowserBack) {
      console.log('CategorySidebar: Detecting return from product page or browser back');
      
      // Đánh dấu là đang quay lại trong context
      setNavigatingBackStatus(true);
      
      // Nếu có rootCategoryId và subcategories trống, thử lấy từ cache
      if (rootCategoryId && subcategories.length === 0) {
        const cachedData = memoizedGetCache(rootCategoryId) || 
                          memoizedGetCache(originalParentId) || 
                          memoizedGetCache(categoryId);
                          
        if (cachedData && cachedData.length > 0) {
          console.log('CategorySidebar: Restoring subcategories from context cache after navigation');
          setSubcategories(cachedData);
          setLoading(false);
          hasFetchedRef.current = true;
          
          // Kiểm tra xem có subcategory đã chọn trước đó không
          const selectedSubId = getSelectedSubcategory(rootCategoryId || categoryId);
          if (selectedSubId) {
            console.log('CategorySidebar: Restoring previously selected subcategory', selectedSubId);
          }
        } else {
          // Kiểm tra localStorage nếu không có trong context
          try {
            // Kiểm tra nhiều khóa để tối đa hóa cơ hội phục hồi dữ liệu
            const keys = [
              `subcategories_${rootCategoryId}`,
              `subcategories_${originalParentId}`,
              `subcategories_${categoryId}`,
              `subcategories_${id}`
            ];
            
            let localData = null;
            
            for (const key of keys) {
              if (!key.includes('undefined') && !key.includes('null')) {
                const data = localStorage.getItem(key);
                if (data) {
                  localData = JSON.parse(data);
                  console.log(`CategorySidebar: Found data in localStorage with key ${key}`);
                  break;
                }
              }
            }
            
            if (localData && localData.length > 0) {
              console.log('CategorySidebar: Restoring subcategories from localStorage after navigation');
              setSubcategories(localData);
              setLoading(false);
              hasFetchedRef.current = true;
            } else {
              // Nếu không tìm thấy dữ liệu, force fetch
              console.log('CategorySidebar: No cached data found, forcing fetch');
              hasFetchedRef.current = false;
              processingRef.current = false; // Reset để cho phép fetch mới
            }
          } catch (error) {
            console.error('Error accessing localStorage after navigation:', error);
          }
        }
      }
    } else {
      // Nếu không phải quay lại, đặt lại trạng thái
      setNavigatingBackStatus(false);
    }
  }, [location, rootCategoryId, originalParentId, categoryId, id, subcategories.length, memoizedGetCache, setNavigatingBackStatus, getSelectedSubcategory]);
  
  // Xử lý khi người dùng click vào một subcategory
  const handleSubcategoryClick = (subcategory) => {
    // Lưu subcategory đã chọn vào context
    setSelectedSubcategory(categoryId, subcategory.category_id);
    
    // Chuyển hướng tới trang subcategory đã chọn
    navigate(`/categories/${subcategory.category_id}`, {
      state: { 
        fromCategory: true, 
        parentCategoryId: categoryId 
      }
    });
  };
  
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
            {filteredSubcategories.map(category => {
              // Chuyển đổi sang số để so sánh chính xác
              const currentId = parseInt(id);
              const catId = parseInt(category.category_id);
              const isActive = currentId === catId;
              
              return (
                <CategoryItem key={category.category_id}>
                  <CategoryLink 
                    to={`/categories/${category.category_id}`}
                    active={isActive ? 1 : 0}
                    onClick={(e) => {
                      e.preventDefault(); // Ngăn chặn hành vi mặc định của Link
                      // Gọi hàm xử lý click mới
                      handleSubcategoryClick(category);
                    }}
                  >
                    {category.name}
                  </CategoryLink>
                </CategoryItem>
              );
            })}
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