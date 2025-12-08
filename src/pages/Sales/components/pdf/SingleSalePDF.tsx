import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { ReceiptPreviewData } from "../../../../types";

// Styles
const styles = StyleSheet.create({
  page: { padding: 25, fontSize: 12, fontFamily: "Helvetica" },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  businessInfo: {
    textAlign: "center",
    marginBottom: 15,
    fontSize: 10,
    lineHeight: 1.5,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    alignSelf: "center",
  },
  section: { marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  tableHeader: {
    flexDirection: "row",
    borderBottom: 1,
    paddingBottom: 4,
    fontWeight: "bold",
    backgroundColor: "#f3f4f6",
    padding: 5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: 0.5,
    borderColor: "#e5e7eb",
    padding: 5,
  },
  cell: { flex: 1, fontSize: 10 },
  bold: { fontWeight: "bold" },
  footer: {
    marginTop: 20,
    fontSize: 10,
    textAlign: "center",
    borderTop: 1,
    paddingTop: 10,
  },
  divider: {
    borderBottom: 1,
    marginVertical: 10,
  },
});

// 📄 Single Sale PDF Component
export default function SingleSalePDF({
  sale,
  settings,
}: {
  sale: any;
  settings?: ReceiptPreviewData;
}) {
  return (
    <Document>
      <Page size={(settings?.invoice_paper_size as any) || "A4"} style={styles.page}>
        {/* Logo */}
        {settings?.logo_url && (
          <Image src={settings.logo_url} style={styles.logo} cache={false} />
        )}

        {/* Business Header */}
        <Text style={styles.header}>
          {settings?.business_name || "SMART SALE POS"}
        </Text>
        <View style={styles.businessInfo}>
          {settings?.address && <Text>{settings.address}</Text>}
          {settings?.phone && <Text>Phone: {settings.phone}</Text>}
          {settings?.email && <Text>Email: {settings.email}</Text>}
          {settings?.website && <Text>Website: {settings.website}</Text>}
        </View>

        {/* Invoice Header */}
        <Text style={styles.subHeader}>
          {settings?.receipt_header || "PAYMENT INVOICE"}
        </Text>
        <Text style={{ fontSize: 12, textAlign: "center", marginBottom: 15 }}>
          Invoice No: {sale.invoice_no}
        </Text>

        {/* Branch Info */}
        {sale.branch && (
          <View style={styles.section}>
            <Text>
              <Text style={styles.bold}>Branch:</Text> {sale.branch?.name}
            </Text>
            <Text>{sale.branch?.address}</Text>
          </View>
        )}

        {/* Customer Info */}
        {settings?.include_customer_details && sale.customer && (
          <View style={styles.section}>
            <Text style={styles.bold}>Customer Details</Text>
            <Text>Name: {sale.customer?.name}</Text>
            <Text>Phone: {sale.customer?.phone}</Text>
            {sale.customer?.address && (
              <Text>Address: {sale.customer?.address}</Text>
            )}
          </View>
        )}

        <View style={styles.divider} />

        {/* Product Table */}
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, { flex: 2 }]}>Product</Text>
          {settings?.show_product_skus && <Text style={styles.cell}>SKU</Text>}
          <Text style={styles.cell}>Qty</Text>
          <Text style={styles.cell}>Price</Text>
          {settings?.show_item_tax_details && (
            <Text style={styles.cell}>Tax</Text>
          )}
          <Text style={styles.cell}>Total</Text>
        </View>

        {sale.items.map((item: any) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={[styles.cell, { flex: 2 }]}>{item.product?.name}</Text>
            {settings?.show_product_skus && (
              <Text style={styles.cell}>{item.product?.sku || "-"}</Text>
            )}
            <Text style={styles.cell}>{item.quantity}</Text>
            <Text style={styles.cell}>{item.unit_price}</Text>
            {settings?.show_item_tax_details && (
              <Text style={styles.cell}>{item.tax || "0.00"}</Text>
            )}
            <Text style={styles.cell}>{item.line_total}</Text>
          </View>
        ))}

        <View style={styles.divider} />

        {/* Totals */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.bold}>Subtotal:</Text>
            <Text>{sale.subtotal || "0.00"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.bold}>Tax:</Text>
            <Text>{sale.tax || "0.00"}</Text>
          </View>

          {/* Group Discount - only show if exists */}
          {sale.group_discount && Number(sale.group_discount) > 0 && (
            <View style={styles.row}>
              <Text style={styles.bold}>Group Discount:</Text>
              <Text>{sale.group_discount}</Text>
            </View>
          )}

          {/* Manual Discount - only show if exists */}
          {sale.manual_discount && Number(sale.manual_discount) > 0 && (
            <View style={styles.row}>
              <Text style={styles.bold}>Manual Discount:</Text>
              <Text>{sale.manual_discount}</Text>
            </View>
          )}

          {/* Total Discount */}
          {sale.discount && Number(sale.discount) > 0 && (
            <View style={styles.row}>
              <Text style={styles.bold}>Total Discount:</Text>
              <Text>{sale.discount}</Text>
            </View>
          )}

          <View style={[styles.row, { marginTop: 10, fontSize: 14 }]}>
            <Text style={styles.bold}>Total:</Text>
            <Text style={styles.bold}>{sale.total || "0.00"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.bold}>Paid:</Text>
            <Text>{sale.paid_amount || "0.00"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.bold}>Due:</Text>
            <Text>
              {(
                Number(sale.total || 0) - Number(sale.paid_amount || 0)
              ).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Payments */}
        {settings?.show_payment_breakdown && sale.payments?.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.bold, { marginBottom: 5 }]}>
              Payment History
            </Text>
            {sale.payments.map((p: any) => (
              <View key={p.id} style={styles.row}>
                <Text>{p.method.toUpperCase()}</Text>
                <Text>{p.amount}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        {settings?.invoice_footer_message && (
          <Text style={styles.footer}>{settings.invoice_footer_message}</Text>
        )}
        {!settings?.invoice_footer_message && (
          <Text style={styles.footer}>Thank you for your business!</Text>
        )}
      </Page>
    </Document>
  );
}
