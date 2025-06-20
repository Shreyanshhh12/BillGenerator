async function submitInvoice() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const invoiceNo = document.getElementById("invoice_number").value;
  const invoiceDate = document.getElementById("invoice_date").value;
  const supplier = document.getElementById("supplier").value;
  const supplier_address = document.getElementById("supplier_address").value;
  const supplier_phone = document.getElementById("supplier_phone").value;
  const supplier_gstin = document.getElementById("supplier_gstin").value;
  const recipient = document.getElementById("recipient").value;
  const recipient_address = document.getElementById("recipient_address").value;
  const recipient_phone = document.getElementById("recipient_phone").value;
  const recipient_gstin = document.getElementById("recipient_gstin").value;
  const totalTaxable = document.getElementById("total-taxable").value;
  const totalTax = document.getElementById("total-tax").value;
  const grandTotal = document.getElementById("grand-total").value;

  // Header
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("TAX INVOICE", 105, 15, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice No: ${invoiceNo}`, 10, 25);
  doc.text(`Invoice Date: ${invoiceDate}`, 150, 25);

  doc.setFont("helvetica", "bold");
  doc.text("Supplier", 10, 35);
  doc.text("Recipient", 110, 35);

  doc.setFont("helvetica", "normal");
  doc.text(supplier, 10, 40);
  doc.text(supplier_address, 10, 45);
  doc.text(`Phone: ${supplier_phone}`, 10, 50);
  doc.text(`GSTIN: ${supplier_gstin}`, 10, 55);

  doc.text(recipient, 110, 40);
  doc.text(recipient_address, 110, 45);
  doc.text(`Phone: ${recipient_phone}`, 110, 50);
  doc.text(`GSTIN: ${recipient_gstin}`, 110, 55);

  // Table
  const headers = [["Item", "HSN", "Qty", "Price", "CGST", "SGST", "Total"]];
  const rows = items.map(it => [
    it.item,
    it.hsn,
    it.qty,
    it.price,
    it.cgstAmt,
    it.sgstAmt,
    it.total
  ]);

  doc.autoTable({
    startY: 65,
    head: headers,
    body: rows,
    theme: "grid",
    styles: { fontSize: 10, halign: "center" },
    headStyles: { fillColor: [22, 22, 22], textColor: 255 }
  });

  const finalY = doc.lastAutoTable.finalY + 10;
  doc.text(`Total Taxable Amount: ₹${totalTaxable}`, 10, finalY);
  doc.text(`Total Tax Amount: ₹${totalTax}`, 10, finalY + 6);

  // Grand Total boxed
  doc.setFont("helvetica", "bold");
  doc.rect(10, finalY + 12, 190, 10);
  doc.text(`Grand Total: ₹${grandTotal}`, 15, finalY + 19);

  // Save to server + open
  const fileName = `invoice_${invoiceNo}.pdf`;
  const blob = doc.output("blob");
  const formData = new FormData();
  formData.append("file", blob, fileName);

  const res = await fetch("/upload", { method: "POST", body: formData });
  if (res.ok) {
    window.open(`/invoices/${fileName}`, "_blank");
    document.getElementById("output").textContent = "✅ Invoice created and opened.";
    items = [];
    renderItems();
  } else {
    document.getElementById("output").textContent = "❌ Error saving invoice.";
  }
}
