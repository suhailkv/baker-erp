const multer = require('multer');
const XLSX = require('xlsx');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

// Multer config
const upload = multer({ dest: 'uploads/' });

// Parse Excel/CSV into JSON
const parseFile = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet);
};

// Export JSON to CSV
const exportCSV = (data) => {
  const parser = new Parser();
  return parser.parse(data);
};

// Export JSON to Excel
const exportExcel = (data) => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  return XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
};

// Export JSON to PDF
const exportPDF = (data, res) => {
  const doc = new PDFDocument();
  doc.pipe(res);

  doc.fontSize(18).text('Raw Materials Report', { align: 'center' });
  doc.moveDown();

  data.forEach((item) => {
    doc.fontSize(12).text(`Name: ${item.name}, Stock: ${item.stock} ${item.unit}`);
  });

  doc.end();
};

module.exports = { upload, parseFile, exportCSV, exportExcel, exportPDF };
