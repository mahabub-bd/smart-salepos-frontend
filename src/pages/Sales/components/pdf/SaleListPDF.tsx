import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 25, fontSize: 10 },
  header: { fontSize: 14, fontWeight: "bold", marginBottom: 10 },
  tableHeader: { flexDirection: "row", borderBottom: 1 },
  cell: { flex: 1, padding: 3 },
  row: { flexDirection: "row", padding: 3 },
});

export default function SaleListPDF({ sales }: { sales: any[] }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Sales Report</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.cell}>Invoice</Text>
          <Text style={styles.cell}>Customer</Text>
          <Text style={styles.cell}>Total</Text>
          <Text style={styles.cell}>Paid</Text>
          <Text style={styles.cell}>Due</Text>
          <Text style={styles.cell}>Type</Text>
          <Text style={styles.cell}>Date</Text>
        </View>

        {sales.map((s) => (
          <View key={s.id} style={styles.row}>
            <Text style={styles.cell}>{s.invoice_no}</Text>
            <Text style={styles.cell}>{s.customer?.name}</Text>
            <Text style={styles.cell}>৳{s.total}</Text>
            <Text style={styles.cell}>৳{s.paid_amount}</Text>
            <Text style={styles.cell}>
              ৳{Number(s.total) - Number(s.paid_amount)}
            </Text>
            <Text style={styles.cell}>{s.sale_type.toUpperCase()}</Text>
            <Text style={styles.cell}>
              {new Date(s.created_at).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}
