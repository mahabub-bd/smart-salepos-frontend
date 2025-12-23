import InventoryListProductWise from "./InventoryListProductWise";

export default function InventoryMaterialPage() {
  return <InventoryListProductWise productType="raw_material,component,consumable,packaging" />;
}
