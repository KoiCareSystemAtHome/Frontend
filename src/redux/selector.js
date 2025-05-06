export const authSlice = (state) => state.authSlice.data;

export const getListMembershipPackageSelector = (state) =>
  state.membershipPackageSlice.listMembership;

export const getListShopSelector = (state) => state.shopSlice.listShop;

export const getListProductManagementSelector = (state) =>
  state.productManagementSlice.listProduct;

export const getListDiseaseSelector = (state) =>
  state.diseasesSlice.listDisease;

export const diseaseDetail = (state) => state.diseasesSlice.diseaseDetail;

export const getListParameterSelector = (state) =>
  state.parameterSlice.listParameter;

export const getListMemberSelector = (state) => state.memberSlice.listMember;

export const getListBlogSelector = (state) => state.blogSlice.listBlog;

export const getListOrderSelector = (state) => state.orderSlice.listOrder;

export const getListReportSelector = (state) => state.reportSlice.listReport;

export const getListCategorySelector = (state) =>
  state.categorySlice.listCategory;

export const getListNormFoodSelector = (state) =>
  state.normFoodSlice.listNormFood;

export const getListTransactionSelector = (state) =>
  state.transactionSlice.transactions;

export const getListWalletWithdrawSelector = (state) =>
  state.transactionSlice.walletWithdrawalData?.transactions || [];
