import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Typography, 
  Box, 
  Chip, 
  Paper,
  Skeleton,
  Fade,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import productService from '../../../services/productService';

const StyledChip = styled(Chip)(({ theme, selected }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: selected ? theme.palette.primary.main : theme.palette.background.default,
  color: selected ? theme.palette.primary.contrastText : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: selected ? theme.palette.primary.dark : theme.palette.action.hover,
  },
  transition: 'all 0.3s ease',
  fontSize: '0.9rem',
  fontWeight: selected ? 'bold' : 'normal',
}));

const SubcategoryList = ({ selectedCategory, onSubcategorySelect }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  useEffect(() => {
    if (!selectedCategory) {
      setSubcategories([]);
      setSelectedSubcategory(null);
      return;
    }

    const fetchSubcategories = async () => {
      try {
        setLoading(true);
        const data = await productService.getSubcategories(selectedCategory.category_id);
        setSubcategories(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching subcategories:', err);
        setError('Failed to load subcategories');
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [selectedCategory]);

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
    if (onSubcategorySelect) {
      onSubcategorySelect(subcategory);
    }
  };

  if (!selectedCategory) {
    return (
      <Box p={2} textAlign="center">
        <Typography variant="body1" color="textSecondary">
          Vui lòng chọn một danh mục từ menu bên trái
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={500}>
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {selectedCategory.name}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {loading ? (
          <Box display="flex" flexWrap="wrap">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton 
                key={item}
                variant="rectangular" 
                width={100} 
                height={32} 
                sx={{ m: 0.5, borderRadius: '16px' }}
              />
            ))}
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : subcategories.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            Không tìm thấy danh mục con
          </Typography>
        ) : (
          <Box display="flex" flexWrap="wrap">
            {subcategories.map((subcategory) => (
              <StyledChip
                key={subcategory.category_id}
                label={subcategory.name}
                onClick={() => handleSubcategoryClick(subcategory)}
                selected={selectedSubcategory && selectedSubcategory.category_id === subcategory.category_id}
                clickable
              />
            ))}
          </Box>
        )}
      </Paper>
    </Fade>
  );
};

export default SubcategoryList; 