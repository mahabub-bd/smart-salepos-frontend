import { lazy } from 'react';

const ProductionRecipeList = lazy(() => import('./ProductionRecipeList'));
const ProductionRecipeFormPage = lazy(() => import('./ProductionRecipeFormPage'));

export { ProductionRecipeFormPage };
export default ProductionRecipeList;