import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
  page: { padding: 25, fontSize: 12, fontFamily: "Helvetica" },
  header: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  section: { marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  tableHeader: { flexDirection: "row", borderBottom: 1, paddingBottom: 4 },
  cell: { flex: 1 },
  bold: { fontWeight: "bold" },
});

// 📄 Single Sale PDF Component
export default function SingleSalePDF({ sale }: { sale: any }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.header}>Sales Invoice #{sale.invoice_no}</Text>

        {/* Branch Info */}
        <View style={styles.section}>
          <Text>
            <Text style={styles.bold}>Branch:</Text> {sale.branch?.name}
          </Text>
          <Text>{sale.branch?.address}</Text>
        </View>

        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.bold}>Customer</Text>
          <Text>{sale.customer?.name}</Text>
          <Text>📞 {sale.customer?.phone}</Text>
          <Text>📍 {sale.customer?.address}</Text>
        </View>

        {/* Product Table */}
        <View style={[styles.section, styles.tableHeader]}>
          <Text style={styles.cell}>Product</Text>
          <Text style={styles.cell}>Qty</Text>
          <Text style={styles.cell}>Unit Price</Text>
          <Text style={styles.cell}>Line Total</Text>
        </View>

        {sale.items.map((item: any) => (
          <View key={item.id} style={styles.row}>
            <Text style={styles.cell}>{item.product?.name}</Text>
            <Text style={styles.cell}>{item.quantity}</Text>
            <Text style={styles.cell}>৳{item.unit_price}</Text>
            <Text style={styles.cell}>৳{item.line_total}</Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.section}>
          <Text>
            <Text style={styles.bold}>Subtotal:</Text> ৳{sale.subtotal || '0.00'}
          </Text>
          <Text>
            <Text style={styles.bold}>Tax:</Text> ৳{sale.tax || '0.00'}
          </Text>

          {/* Group Discount - only show if exists */}
          {sale.group_discount && Number(sale.group_discount) > 0 && (
            <Text>
              <Text style={styles.bold}>Group Discount:</Text> ৳{sale.group_discount}
            </Text>
          )}

          {/* Manual Discount - only show if exists */}
          {sale.manual_discount && Number(sale.manual_discount) > 0 && (
            <Text>
              <Text style={styles.bold}>Manual Discount:</Text> ৳{sale.manual_discount}
            </Text>
          )}

          {/* Total Discount */}
          {sale.discount && Number(sale.discount) > 0 && (
            <Text>
              <Text style={styles.bold}>Total Discount:</Text> ৳{sale.discount}
            </Text>
          )}

          <Text>
            <Text style={styles.bold}>Total:</Text> ৳{sale.total || '0.00'}
          </Text>
          <Text>
            <Text style={styles.bold}>Paid:</Text> ৳{sale.paid_amount || '0.00'}
          </Text>
          <Text>
            <Text style={styles.bold}>Due:</Text> ৳
            {(Number(sale.total || 0) - Number(sale.paid_amount || 0)).toFixed(2)}
          </Text>
        </View>

        {/* Payments */}
        {sale.payments?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.bold}>Payments</Text>
            {sale.payments.map((p: any) => (
              <Text key={p.id}>
                - {p.method.toUpperCase()} → ৳{p.amount} ({p.account_code})
              </Text>
            ))}
          </View>
        )}

        {/* Footer */}
        <Text style={{ marginTop: 20, fontSize: 10, textAlign: "center" }}>
          Thank you for your business!
        </Text>
      </Page>
    </Document>
  );
}
