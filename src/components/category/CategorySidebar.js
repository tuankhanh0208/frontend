import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Skeleton,
} from '@mui/material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useCategories } from '../../context/CategoryContext';
import { NavLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const CategoryNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  width: '100%',
  '&.active': {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    '& .MuiTypography-root': {
      fontWeight: 'bold',
    },
  },
}));

const CategorySidebar = ({ handleClose }) => {
  const { categoryId } = useParams();
  const location = useLocation();
  const { categories, loading, fetchSubcategories } = useCategories();
  const [subcategories, setSubcategories] = useState([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  
  // Khóa cho sessionStorage
  const subcategoriesKey = categoryId ? `subcategories_${categoryId}` : null;

  useEffect(() => {
    // Khi category thay đổi, cần cập nhật subcategories
    const loadSubcategories = async () => {
      if (!categoryId) return;
      
      setLoadingSubcategories(true);
      
      // Thử lấy từ sessionStorage trước
      let cachedSubcategories = null;
      try {
        const cached = sessionStorage.getItem(subcategoriesKey);
        if (cached) {
          cachedSubcategories = JSON.parse(cached);
          console.log(`Loaded cached subcategories for category ${categoryId}`);
        }
      } catch (e) {
        console.error('Error loading cached subcategories:', e);
      }
      
      if (cachedSubcategories) {
        setSubcategories(cachedSubcategories);
        setLoadingSubcategories(false);
      } else {
        try {
          console.log(`Fetching subcategories for category ${categoryId}`);
          const data = await fetchSubcategories(categoryId);
          if (data && data.length > 0) {
            setSubcategories(data);
            
            // Lưu vào sessionStorage
            try {
              sessionStorage.setItem(subcategoriesKey, JSON.stringify(data));
            } catch (e) {
              console.error('Error caching subcategories:', e);
            }
          }
        } catch (error) {
          console.error('Failed to fetch subcategories:', error);
        } finally {
          setLoadingSubcategories(false);
        }
      }
    };

    loadSubcategories();
  }, [categoryId, fetchSubcategories, subcategoriesKey]);
  
  // Xử lý sự kiện đóng mobile menu (nếu có) khi nhấp vào danh mục
  const handleCategoryClick = () => {
    if (handleClose && typeof handleClose === 'function') {
      handleClose();
    }
  };

  // Rendering skeleton khi đang tải
  const renderSkeletons = () => {
    return Array(5)
      .fill(null)
      .map((_, index) => (
        <ListItem key={index} disablePadding>
          <Skeleton variant="rectangular" width="100%" height={40} />
        </ListItem>
      ));
  };

  // Hiển thị danh sách danh mục
  const renderCategories = () => {
    if (!categories || categories.length === 0) {
      return <Typography>Không có danh mục nào</Typography>;
    }

    return categories.map((category) => (
      <ListItem key={category.id} disablePadding>
        <CategoryNavLink
          to={`/category/${category.id}/${encodeURIComponent(category.name.toLowerCase().replace(/ /g, '-'))}`}
          className={category.id === parseInt(categoryId) ? 'active' : ''}
          onClick={handleCategoryClick}
        >
          <ListItemButton>
            <ListItemText primary={category.name} />
          </ListItemButton>
        </CategoryNavLink>
      </ListItem>
    ));
  };

  // Hiển thị danh sách danh mục con
  const renderSubcategories = () => {
    if (loadingSubcategories) {
      return renderSkeletons();
    }

    if (!subcategories || subcategories.length === 0) {
      return categoryId ? (
        <Typography variant="body2" sx={{ padding: 2 }}>
          Không có danh mục con
        </Typography>
      ) : null;
    }

    return subcategories.map((subcategory) => (
      <ListItem key={subcategory.id} disablePadding>
        <CategoryNavLink
          to={`/subcategory/${subcategory.id}/${encodeURIComponent(subcategory.name.toLowerCase().replace(/ /g, '-'))}`}
          onClick={handleCategoryClick}
        >
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon sx={{ minWidth: 30 }}>
              <ArrowRightAltIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={subcategory.name} />
          </ListItemButton>
        </CategoryNavLink>
      </ListItem>
    ));
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold' }}>
        Danh mục sản phẩm
      </Typography>
      <List component="nav" aria-label="categories">
        {loading ? renderSkeletons() : renderCategories()}
      </List>
      {categoryId && (
        <>
          <Typography variant="subtitle1" sx={{ p: 2, pt: 0, fontWeight: 'bold' }}>
            Danh mục con
          </Typography>
          <List component="nav" aria-label="subcategories">
            {renderSubcategories()}
          </List>
        </>
      )}
    </Box>
  );
};

export default CategorySidebar; 