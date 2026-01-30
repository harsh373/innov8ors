export const validateReportInput = (data: any) => {
  const errors: any = {};

  // Product name validation
  if (!data.productName || data.productName.trim().length < 2) {
    errors.productName = 'Product name must be at least 2 characters';
  }
  if (data.productName && data.productName.length > 100) {
    errors.productName = 'Product name cannot exceed 100 characters';
  }

  // Price validation
  if (!data.price || data.price <= 0) {
    errors.price = 'Price must be a positive number';
  }
  if (data.price && data.price > 1000000) {
    errors.price = 'Price seems unrealistic';
  }

  // Unit validation
  const validUnits = ['kg', 'liter', 'piece', 'dozen', 'gram', 'quintal'];
  if (!data.unit || !validUnits.includes(data.unit.toLowerCase())) {
    errors.unit = 'Invalid unit. Must be one of: kg, liter, piece, dozen, gram, quintal';
  }

  // Store name validation
  if (!data.storeName || data.storeName.trim().length < 2) {
    errors.storeName = 'Store name must be at least 2 characters';
  }
  if (data.storeName && data.storeName.length > 200) {
    errors.storeName = 'Store name cannot exceed 200 characters';
  }

  // Area validation
  if (!data.area || data.area.trim().length < 2) {
    errors.area = 'Area must be at least 2 characters';
  }
  if (data.area && data.area.length > 200) {
    errors.area = 'Area cannot exceed 200 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validatePagination = (page?: string, limit?: string) => {
  const pageNum = parseInt(page || '1');
  const limitNum = parseInt(limit || '10');

  return {
    page: isNaN(pageNum) || pageNum < 1 ? 1 : pageNum,
    limit: isNaN(limitNum) || limitNum < 1 || limitNum > 100 ? 10 : limitNum,
  };
};
