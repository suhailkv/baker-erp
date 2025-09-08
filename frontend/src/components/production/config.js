export const DEFAULT_FORM = {
    productId : null,
  productName: "",
  quantity: "",
  unit: "kg",
  rawMaterials: [{ rawMaterialId: null, name: "", usedQty: 0 }],
};

export const API_ENDPOINTS = {
  RAW_MATERIALS: "/raw-materials",
  PRODUCTIONS: "/productions",
  PRODUCTS: "/general/expense-names", 
};
