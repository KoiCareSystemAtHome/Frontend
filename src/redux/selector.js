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

export const getLissMemberSelector = (state) => state.memberSlice.listMember;
