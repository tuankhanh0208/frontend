import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AdminLayout from '../../layouts/AdminLayout';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { TbDots } from 'react-icons/tb';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';
import AddProductModal from '../../components/admin/AddProductModal';

const Container = styled.div`
  padding: 20px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const HeaderContent = styled.div``;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const Description = styled.p`
  color: #666;
  margin: 5px 0 20px 0;
  font-size: 14px;
`;

const SearchFilter = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const SearchInput = styled.div`
  position: relative;
  flex: 1;
  
  input {
    width: 100%;
    padding: 8px 15px 8px 40px;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: #4CAF50;
    }
  }
  
  svg {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }
`;

const FilterDropdown = styled.select`
  padding: 8px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background-color: #388E3C;
  }
`;

const ColumnsButton = styled.button`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: white;
  color: #333;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ProductsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.thead`
  background-color: #f5f5f5;
  
  th {
    padding: 12px 15px;
    text-align: left;
    font-weight: 500;
    color: #333;
    border-bottom: 1px solid #e0e0e0;
    
    &:last-child {
      text-align: center;
    }
  }
`;

const TableBody = styled.tbody`
  tr {
    &:hover {
      background-color: #f9f9f9;
    }
    
    &:not(:last-child) {
      border-bottom: 1px solid #e0e0e0;
    }
  }
  
  td {
    padding: 12px 15px;
    color: #333;
    
    &:last-child {
      text-align: center;
    }
  }
`;

const PriceCell = styled.td`
  font-weight: 500;
`;

const StatusCell = styled.td`
  span {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    background-color: ${props => props.status === 'Mới' ? 'rgba(76, 175, 80, 0.1)' : '#f5f5f5'};
    color: ${props => props.status === 'Mới' ? '#4CAF50' : '#333'};
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  font-size: 16px;
  padding: 5px;
  
  &:hover {
    color: #4CAF50;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

const PageInfo = styled.div`
  color: #666;
  font-size: 14px;
`;

const PageControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: ${props => props.active ? '#4CAF50' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#4CAF50' : '#f5f5f5'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ActionMenu = styled.div`
  position: relative;
`;

const ActionMenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 150px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
  z-index: 10;
  
  button {
    width: 100%;
    text-align: left;
    padding: 10px 15px;
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-size: 14px;
    color: #333;
    
    &:hover {
      background-color: #f5f5f5;
    }
    
    &.delete {
      color: #F44336;
    }
  }
`;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mocked products data - Replace this with actual API call in a real application
  useEffect(() => {
    // Sample data based on the image
    const mockProducts = [
      { id: 1, name: 'Vision Blind Guard', price: 125.00, originalPrice: 85.00, quantity: 200, category: 'Rau', size: '300g', condition: 'Mới', date: '04/18/2025' },
      { id: 2, name: 'Vision Blind Guard', price: 125.00, originalPrice: 85.00, quantity: 200, category: 'Rau', size: '300g', condition: 'Mới', date: '04/18/2025' },
      { id: 3, name: 'Vision Blind Guard', price: 125.00, originalPrice: 85.00, quantity: 200, category: 'Rau', size: '300g', condition: 'Mới', date: '04/18/2025' },
      { id: 4, name: 'Vision Blind Guard', price: 125.00, originalPrice: 85.00, quantity: 200, category: 'Rau', size: '300g', condition: 'Mới', date: '04/18/2025' },
      { id: 5, name: 'Vision Blind Guard', price: 125.00, originalPrice: 85.00, quantity: 200, category: 'Rau', size: '300g', condition: 'Mới', date: '04/18/2025' },
      { id: 6, name: 'Vision Blind Guard', price: 125.00, originalPrice: 85.00, quantity: 200, category: 'Rau', size: '300g', condition: 'Mới', date: '04/18/2025' },
    ];

    setProducts(mockProducts);
    setLoading(false);
    setTotalPages(1); // For demo purposes
  }, []);

  const handleAddProduct = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveProduct = async (productData) => {
    try {
      // Đây sẽ là nơi gọi API để lưu sản phẩm
      console.log('Saving product:', productData);
      toast.success('Sản phẩm đã được thêm thành công!');
      
      // Ở đây bạn có thể làm mới danh sách sản phẩm
      // const updatedProducts = await adminService.getProducts();
      // setProducts(updatedProducts);
    } catch (error) {
      console.error('Lỗi khi lưu sản phẩm:', error);
      toast.error('Đã xảy ra lỗi khi thêm sản phẩm.');
      throw error;
    }
  };

  const handleEdit = (productId) => {
    toast.info(`Chỉnh sửa sản phẩm ID: ${productId}`);
    setActionMenuOpen(null);
  };

  const handleCopyId = (productId) => {
    navigator.clipboard.writeText(productId);
    toast.success(`Đã sao chép ID: ${productId}`);
    setActionMenuOpen(null);
  };

  const handleDelete = (productId) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?');
    if (confirmDelete) {
      toast.success(`Đã xóa sản phẩm ID: ${productId}`);
      setProducts(products.filter(product => product.id !== productId));
    }
    setActionMenuOpen(null);
  };

  const toggleActionMenu = (productId) => {
    if (actionMenuOpen === productId) {
      setActionMenuOpen(null);
    } else {
      setActionMenuOpen(productId);
    }
  };

  return (
    <Container>
      <HeaderContent>
        <PageHeader>
          <Title>Sản phẩm</Title>
          <AddButton onClick={handleAddProduct}>
            <FaPlus /> Thêm sản phẩm
          </AddButton>
        </PageHeader>
        <Description>
          Quản lý sản phẩm và theo dõi việc bổ sung hàng tại đây.
        </Description>
      </HeaderContent>

      <SearchFilter>
        <SearchInput>
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInput>

        <FilterDropdown
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Status</option>
          <option value="instock">Còn hàng</option>
          <option value="outofstock">Hết hàng</option>
        </FilterDropdown>

        <FilterDropdown
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">Category</option>
          <option value="rau">Rau</option>
          <option value="cu">Củ</option>
          <option value="qua">Quả</option>
        </FilterDropdown>

        <ColumnsButton>
          Columns
        </ColumnsButton>
      </SearchFilter>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <>
          <ProductsTable>
            <TableHeader>
              <tr>
                <th>Tên</th>
                <th>Giá bán</th>
                <th>Giá gốc</th>
                <th>Số lượng</th>
                <th>Category</th>
                <th>Size</th>
                <th>Condition</th>
                <th>Date</th>
                <th></th>
              </tr>
            </TableHeader>
            <TableBody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <PriceCell>{product.price.toLocaleString()}đ</PriceCell>
                  <PriceCell>{product.originalPrice.toLocaleString()}đ</PriceCell>
                  <td>{product.quantity}</td>
                  <td>{product.category}</td>
                  <td>{product.size}</td>
                  <StatusCell status={product.condition}>
                    <span>{product.condition}</span>
                  </StatusCell>
                  <td>{product.date}</td>
                  <td>
                    <ActionMenu>
                      <ActionButton onClick={() => toggleActionMenu(product.id)}>
                        <TbDots />
                      </ActionButton>

                      {actionMenuOpen === product.id && (
                        <ActionMenuDropdown>
                          <button onClick={() => handleEdit(product.id)}>Sửa</button>
                          <button onClick={() => handleCopyId(product.id)}>Copy ID</button>
                          <button className="delete" onClick={() => handleDelete(product.id)}>Xóa</button>
                        </ActionMenuDropdown>
                      )}
                    </ActionMenu>
                  </td>
                </tr>
              ))}
            </TableBody>
          </ProductsTable>

          <Pagination>
            <PageInfo>
              Trang 1 trên 1
            </PageInfo>
            <PageControls>
              <PageButton disabled>&lt;&lt;</PageButton>
              <PageButton disabled>&lt;</PageButton>
              <PageButton active>1</PageButton>
              <PageButton disabled>&gt;</PageButton>
              <PageButton disabled>&gt;&gt;</PageButton>
            </PageControls>
          </Pagination>
        </>
      )}

      <AddProductModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        isLoading={false}
      />
    </Container>);
};

export default ProductList;